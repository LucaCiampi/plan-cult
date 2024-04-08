import Config from '@/constants/Config';
import { fetchDataFromStrapi } from '@/utils/strapiUtils';
import { downloadImage } from '@/utils/downloadUtils';
import SQLiteService from './SqliteService';

class SyncService {
  constructor(private readonly sqliteService: SQLiteService) {}

  async syncAll(): Promise<void> {
    await this.syncCharactersData();
  }

  async syncCharactersData(): Promise<void> {
    await this.sqliteService.initializeDB();
    // await this.initializeDB();
    await this.initializeTable('characters', {
      id: 'INTEGER PRIMARY KEY',
      name: 'TEXT',
      surname: 'TEXT',
      birth: 'TEXT',
      death: 'TEXT',
      avatarUrl: 'TEXT',
    });

    await this.checkAndAlterTable('characters', {
      id: 'INTEGER PRIMARY KEY',
      name: 'TEXT',
      surname: 'TEXT',
      birth: 'TEXT',
      death: 'TEXT',
      avatarUrl: 'TEXT',
    });

    const characters = await fetchDataFromStrapi('characters?populate=*');
    console.log('syncCharactersData', characters);

    const insertQuery = `
      INSERT INTO characters (id, name, surname, birth, death, avatarUrl)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      surname=excluded.surname,
      birth=excluded.birth,
      death=excluded.death,
      avatarUrl=excluded.avatarUrl
    `;

    if (this.sqliteService.db == null) {
      throw new Error('Database is not initialized.');
    }

    for (const character of characters) {
      try {
        const avatarObjectUrl = character.avatar.data.attributes.url;

        const hasAvatar = Boolean(avatarObjectUrl);
        const distantAvatarUrl = Config.STRAPI_DOMAIN_URL + avatarObjectUrl;

        const localAvatarUri = hasAvatar
          ? await downloadImage(distantAvatarUrl)
          : null;

        const result = await this.sqliteService.db.runAsync(insertQuery, [
          character.id,
          character.name,
          character.surname,
          character.birth,
          character.death,
          localAvatarUri,
        ]);
        console.log('💽 syncCharactersData', result.lastInsertRowId);
      } catch (error) {
        console.error('Error processing character:', character.id, error);
      }
    }
  }

  async initializeTable(
    tableName: string,
    columns: Record<string, string>
  ): Promise<void> {
    if (this.sqliteService.db == null) {
      throw new Error('Database is not initialized.');
    }

    const columnsDefinition = Object.entries(columns)
      .map(([name, type]) => `${name} ${type}`)
      .join(', ');
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsDefinition})`;

    try {
      await this.sqliteService.db.runAsync(createTableQuery);
      console.log(`Table \`${tableName}\` is ready.`);
    } catch (error) {
      console.error(`Failed to create table \`${tableName}\`:`, error);
    }
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
}

export default SyncService;
