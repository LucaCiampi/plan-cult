import Config from '@/constants/Config';
import { fetchDataFromStrapi } from '@/utils/strapiUtils';
import { downloadImage } from '@/utils/downloadUtils';
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
      avatarUrl: 'TEXT',
    },
    current_conversation_state: {
      character_id: 'INTEGER PRIMARY KEY',
      dialogue_id: 'TEXT NOT NULL',
      following_dialogues_id: 'TEXT',
    },
  };

  async syncAll(): Promise<void> {
    await this.sqliteService.initializeDB(); // Assure that DB is initialized before syncing
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
    console.log('syncCharactersData', characters);

    const insertQuery = `
      INSERT INTO ${tableName} (id, name, surname, birth, death, avatarUrl)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      surname=excluded.surname,
      birth=excluded.birth,
      death=excluded.death,
      avatarUrl=excluded.avatarUrl
    `;

    for (const character of characters) {
      try {
        const avatarAttributeLink = character.avatar.data.attributes.url;
        const hasAvatar = Boolean(avatarAttributeLink);
        const avatarUrl = Config.STRAPI_DOMAIN_URL + avatarAttributeLink;
        const localAvatarUri = hasAvatar
          ? await this.safeDownloadImage(avatarUrl)
          : null;

        await this.sqliteService.db?.runAsync(insertQuery, [
          character.id,
          character.name,
          character.surname,
          character.birth,
          character.death,
          localAvatarUri,
        ]);
        console.log('💽 Character synced:', character.name);
      } catch (error) {
        console.error('Error processing character:', character.id, error);
      }
    }
  }

  async safeDownloadImage(imageUrl: string): Promise<string | null> {
    try {
      return await downloadImage(imageUrl);
    } catch (error) {
      console.error('Failed to download image:', imageUrl, error);
      return null; // Return null if the image can't be downloaded
    }
  }

  async initializeTable(
    tableName: string,
    columns: Record<string, string>
  ): Promise<void> {
    const columnsDefinition = Object.entries(columns)
      .map(([name, type]) => `${name} ${type}`)
      .join(', ');

    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsDefinition})`;

    await this.sqliteService.db?.runAsync(createTableQuery);
    console.log(`Table \`${tableName}\` is ready.`);
  }

  async checkAndAlterTable(
    tableName: string,
    requiredColumns: Record<string, string>
  ): Promise<void> {
    if (this.sqliteService.db == null) {
      throw new Error('Database is not initialized.');
    }

    try {
      const tableInfo = await this.sqliteService.db.getAllAsync(
        `PRAGMA table_info(${tableName});`
      );
      const existingColumns = tableInfo.map((column: any) => column.name);

      const missingColumns = Object.entries(requiredColumns).filter(
        ([columnName]) => !existingColumns.includes(columnName)
      );

      for (const [columnName, columnType] of missingColumns) {
        await this.sqliteService.db.runAsync(
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

  async syncCurrentConversationStateData(): Promise<void> {
    const tableName = 'current_conversation_state';
    await this.initializeTable(tableName, this.tableDefinitions[tableName]);
    await this.checkAndAlterTable(tableName, this.tableDefinitions[tableName]);

    const data = await fetchDataFromStrapi(
      'current-dialogue-states?populate[0]=character&populate[1]=dialogues'
    );

    const insertQuery = `
      INSERT INTO ${tableName} (character_id, dialogue_id, following_dialogues_id)
      VALUES (?, ?, ?)
      ON CONFLICT(character_id) DO UPDATE SET
      dialogue_id=excluded.dialogue_id,
      following_dialogues_id=excluded.following_dialogues_id
    `;

    for (const currentDialogueState of data) {
      const followingDialoguesId: number[] =
        currentDialogueState.dialogues.data.map((element: any) => element.id);
      const followingDialoguesIdStr = JSON.stringify(followingDialoguesId);

      try {
        await this.sqliteService.db?.runAsync(insertQuery, [
          currentDialogueState.character.data.id,
          followingDialoguesIdStr,
          followingDialoguesIdStr,
        ]);
        console.log(
          '💽 currentDialogueState synced:',
          currentDialogueState.character.data.attributes.name
        );
      } catch (error) {
        console.error(
          'Error processing currentDialogueState:',
          currentDialogueState.character.data.attributes.name,
          error
        );
      }
    }

    console.log(`Synced \`${tableName}\` data.`);
  }
}

export default SyncService;
