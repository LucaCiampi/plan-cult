import Config from '@/constants/Config';
import { fetchDataFromStrapi } from '@/utils/strapiUtils';
import SQLiteService from './SqliteService';

class SyncService {
  constructor(private readonly sqliteService: SQLiteService) {}

  tableDefinitions = {
    characters: {
      id: 'INTEGER PRIMARY KEY',
      name: 'TEXT',
      surname: 'TEXT',
      birth: 'TEXT',
      death: 'TEXT',
      avatar_url: 'TEXT',
    },
    current_conversation_state: {
      character_id: 'INTEGER PRIMARY KEY',
      dialogue_id: 'TEXT NOT NULL',
      following_dialogues_id: 'TEXT',
    },
  };

  async syncAll(): Promise<void> {
    // Exécute des tâches en parallèle étant donné qu'elles sont indépendantes
    await Promise.all([
      this.syncCharactersData(),
      this.syncCurrentConversationStateData(),
    ]);
  }

  async syncCharactersData(): Promise<void> {
    const tableName = 'characters';
    await this.initializeTable(tableName, this.tableDefinitions[tableName]);
    await this.checkAndAlterTable(tableName, this.tableDefinitions[tableName]);

    const characters = await fetchDataFromStrapi('characters?populate=*');

    // Transformation des données reçues pour correspondre à la structure de la table
    const transformedData: Character[] = characters.map(
      (character: Character) => ({
        id: character.id,
        name: character.name,
        surname: character.surname,
        birth: character.birth,
        death: character.death,
        avatar_url:
          character.avatar.data.attributes.url !== null
            ? Config.STRAPI_DOMAIN_URL + character.avatar.data.attributes.url
            : null,
      })
    );

    await this.insertDataGeneric(
      tableName,
      transformedData,
      this.tableDefinitions[tableName]
    );
  }

  async syncCurrentConversationStateData(): Promise<void> {
    const tableName = 'current_conversation_state';
    await this.initializeTable(tableName, this.tableDefinitions[tableName]);
    await this.checkAndAlterTable(tableName, this.tableDefinitions[tableName]);

    const data = await fetchDataFromStrapi(
      'current-dialogue-states?populate[0]=character&populate[1]=dialogues'
    );

    // Transformation des données pour qu'elles correspondent à la structure de la table
    const transformedData: CurrentConversationState[] = data.map(
      (currentDialogueState: CurrentConversationState) => {
        const followingDialoguesId: number[] =
          currentDialogueState.dialogues.data.map((element: any) => element.id);
        const followingDialoguesIdStr = JSON.stringify(followingDialoguesId);

        return {
          character_id: currentDialogueState.character.data.id,
          dialogue_id: followingDialoguesIdStr, // Supposant que cela doit être stocké une fois
          following_dialogues_id: followingDialoguesIdStr, // Et répété ici selon ton exemple initial
        };
      }
    );

    await this.insertDataGeneric(
      tableName,
      transformedData,
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
    console.log(`Table \`${tableName}\` is ready.`);
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
        console.log(`💽 Data synced in ${tableName}:`, item);
      } catch (error) {
        console.error(`Error processing item in ${tableName}:`, item, error);
      }
    }
  }
}

export default SyncService;
