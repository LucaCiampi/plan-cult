import { downloadImage } from '@/utils/downloadUtils';
import SQLiteService from '@/services/SqliteService';
import StrapiService from '@/services/StrapiService';

class SyncService {
  private readonly strapiService: StrapiService;

  constructor(
    private readonly sqliteService: SQLiteService,
    strapiService: StrapiService
  ) {
    this.strapiService = strapiService;
  }

  tableDefinitions = {
    characters: {
      id: 'INTEGER PRIMARY KEY',
      name: 'TEXT',
      surname: 'TEXT',
      birth: 'TEXT',
      death: 'TEXT',
      avatar_url: 'TEXT',
      detoured_character: 'TEXT',
      trust_level: 'INTEGER NOT NULL',
      city: 'TEXT',
    },
    dialogue_anchor: {
      id: 'INTEGER PRIMARY KEY',
      character_id: 'INTEGER NOT NULL',
      dialogues_id: 'TEXT NOT NULL',
      trust_level: 'INTEGER NOT NULL',
    },
    current_conversation_state: {
      character_id: 'INTEGER PRIMARY KEY',
      dialogue_id: 'TEXT',
      following_dialogues_id: 'TEXT',
    },
  };

  async syncAll(): Promise<void> {
    // Exécute des tâches en parallèle étant donné qu'elles sont indépendantes
    await Promise.all([
      this.syncCharactersData(),
      this.syncDialogueAnchorData(),
    ]);
    await this.syncCurrentConversationStateData();
  }

  async syncCharactersData(): Promise<void> {
    const tableName = 'characters';
    await this.initializeTable(tableName, this.tableDefinitions[tableName]);
    await this.checkAndAlterTable(tableName, this.tableDefinitions[tableName]);

    const characters = await this.strapiService.getAllCharacters();
    // On télécharge les images
    const data = await Promise.all(
      characters.map(async (elem) => ({
        ...elem,
        avatar_url:
          Boolean(elem.avatar_url) &&
          (await downloadImage(elem.avatar_url ?? '')),
        detoured_character:
          Boolean(elem.detoured_character) &&
          (await downloadImage(elem.detoured_character ?? '')),
        trust_level: 0,
      }))
    );

    await this.insertDataGeneric(
      tableName,
      data,
      this.tableDefinitions[tableName]
    );
  }

  async syncDialogueAnchorData(): Promise<void> {
    const tableName = 'dialogue_anchor';
    await this.initializeTable(tableName, this.tableDefinitions[tableName]);
    await this.checkAndAlterTable(tableName, this.tableDefinitions[tableName]);

    // On stringify les données afin de les insérer sur SQLite
    const data = (await this.strapiService.getAllDialogueAnchors()).map(
      (elem) => ({
        ...elem,
        dialogues_id: JSON.stringify(elem.dialogues_id),
      })
    );

    await this.insertDataGeneric(
      tableName,
      data,
      this.tableDefinitions[tableName]
    );
  }

  async syncCurrentConversationStateData(): Promise<void> {
    const tableName = 'current_conversation_state';
    await this.initializeTable(tableName, this.tableDefinitions[tableName]);
    await this.checkAndAlterTable(tableName, this.tableDefinitions[tableName]);

    // On stringify les données afin de les insérer sur SQLite
    let data = await this.sqliteService.getAllDialogueAnchorsOfTrustLevel(0);
    data = data.map((elem) => ({
      ...elem,
      following_dialogues_id: elem.dialogues_id,
    }));

    await this.insertDataGeneric(
      tableName,
      data,
      this.tableDefinitions[tableName],
      'character_id'
    );
  }

  async initializeTable(
    tableName: string,
    columns: Record<string, string>
  ): Promise<void> {
    const columnsDefinition = Object.entries(columns)
      .map(([name, type]) => `${name} ${type}`)
      .join(', ');

    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsDefinition})`;

    const db = await this.sqliteService.dbPromise;
    await db.runAsync(createTableQuery);
    // console.log(`Table \`${tableName}\` is ready.`);
  }

  async checkAndAlterTable(
    tableName: string,
    requiredColumns: Record<string, string>
  ): Promise<void> {
    try {
      const db = await this.sqliteService.dbPromise;
      const tableInfo = await db.getAllAsync(
        `PRAGMA table_info(${tableName});`
      );
      const existingColumns = tableInfo.map((column: any) => column.name);

      const missingColumns = Object.entries(requiredColumns).filter(
        ([columnName]) => !existingColumns.includes(columnName)
      );

      for (const [columnName, columnType] of missingColumns) {
        await db.runAsync(
          `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType};`
        );
      }

      if (missingColumns.length > 0) {
        console.log(
          `Added missing columns: ${missingColumns
            .map(([name]) => name)
            .join(', ')}`
        );
      } else {
        console.log('No columns were missing.');
      }
    } catch (error) {
      console.error(`Failed to check or alter table \`${tableName}\`:`, error);
    }
  }

  /**
   * Inserts data to table automatically
   * @param tableName the table name
   * @param data array containing values to insert
   * @param tableDefinition record containing column names and constraints
   */
  async insertDataGeneric(
    tableName: string,
    data: any[],
    tableDefinition: Record<string, string>,
    primaryKey: string = 'id' // Valeur par défaut 'id' pour la rétrocompatibilité
  ): Promise<void> {
    const db = await this.sqliteService.dbPromise;
    const columns = Object.keys(tableDefinition);
    const placeholders = columns.map(() => '?').join(', ');
    const onConflictUpdate = columns
      .filter((column) => column !== primaryKey) // Utiliser primaryKey au lieu de 'id' directement
      .map((column) => `${column}=excluded.${column}`)
      .join(', ');

    const insertQuery = `
      INSERT INTO ${tableName} (${columns.join(', ')})
      VALUES (${placeholders})
      ON CONFLICT(${primaryKey}) DO UPDATE SET
      ${onConflictUpdate}
    `;

    for (const item of data) {
      const values = columns.map((column) => item[column] ?? null);
      try {
        await db.runAsync(insertQuery, values);
        // console.log(`💽 Data synced in ${tableName}:`, item);
      } catch (error) {
        console.error(`Error processing item in ${tableName}:`, item, error);
      }
    }
  }
}

export default SyncService;
