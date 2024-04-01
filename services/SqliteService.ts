import * as SQLite from 'expo-sqlite/next';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Config from '@/constants/Config';
import { Platform } from 'react-native';

class SQLiteService implements IDatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  constructor() {
    void this.initializeDB();
  }

  async initializeDB(): Promise<void> {
    if (this.db == null && Platform.OS !== 'web') {
      const databaseFilename = 'db.db';
      const documentsDirectory = FileSystem.documentDirectory;
      const sqlLiteDirectory = `${documentsDirectory}SQLite/`;
      const internalDbName = `${sqlLiteDirectory}${databaseFilename}`;

      // Vérifie et créé le répertoire SQLite si nécessaire
      const dirInfo = await FileSystem.getInfoAsync(sqlLiteDirectory);
      if (!dirInfo.exists) {
        console.log('Création du répertoire SQLite.');
        await FileSystem.makeDirectoryAsync(sqlLiteDirectory, {
          intermediates: true,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      // const dbAsset = Asset.fromModule(require('../assets/databases/db.db'));
      const dbAsset = Asset.fromModule(
        require('../assets/databases/db.db') as string
      );

      try {
        if (Config.DEBUG) {
          console.log(
            '🪲 Mode débogage activé : Recopie systématique de la base de données.'
          );
          console.log(
            `Tentative de téléchargement de la base de données depuis ${dbAsset.uri} vers ${internalDbName}`
          );
          const downloadResult = await FileSystem.downloadAsync(
            dbAsset.uri,
            internalDbName
          );
          console.log(
            `Téléchargement réussi : ${JSON.stringify(downloadResult)}`
          );
        } else {
          console.log(
            `Vérification de l'existence de la base de données à ${internalDbName}`
          );
          const fileInfo = await FileSystem.getInfoAsync(internalDbName);
          if (!fileInfo.exists) {
            console.log(
              "La base de données n'existe pas, début du téléchargement..."
            );
            await FileSystem.downloadAsync(dbAsset.uri, internalDbName);
            console.log('Téléchargement de la base de données réussi.');
          } else {
            console.log(
              'La base de données existe déjà, pas besoin de la télécharger.'
            );
          }
        }

        console.log('Ouverture de la base de données...');
        this.db = await SQLite.openDatabaseAsync(databaseFilename);
      } catch (error) {
        console.error(
          `Erreur lors de la préparation de la base de données : ${
            typeof error === 'string' ? error : JSON.stringify(error)
          }`
        );
        throw error; // Rethrow l'erreur pour indiquer un échec dans le flux d'exécution appelant.
      }
    }
  }

  async getAllCharacters(): Promise<Character[]> {
    await this.initializeDB();
    if (this.db == null) {
      throw new Error('Database is not initialized.');
    }
    const allRows = await this.db.getAllAsync('SELECT * FROM CHARACTERS');
    return allRows as Character[];
  }

  async getAllLikedCharacters(): Promise<Character[]> {
    await this.initializeDB();
    if (this.db == null) {
      throw new Error('Database is not initialized.');
    }
    const allRows = await this.db.getAllAsync(
      'SELECT * FROM CHARACTERS WHERE liked = true'
    );
    return allRows as Character[];
  }

  async saveConversationToConversationHistory(
    characterId: number,
    isSentByUser: boolean,
    message: string
  ): Promise<any> {
    await this.initializeDB();
    if (this.db == null) {
      throw new Error('Database is not initialized.');
    }
    const currentDate = new Date();
    const fromUser = isSentByUser ? 1 : 0;
    void (await this.db.runAsync(
      'INSERT INTO conversation_history (character_id, date_sent, from_user, message) VALUES (?, ?, ?, ?)',
      characterId,
      currentDate.toString(),
      fromUser,
      message.toString()
    ));
    console.log('💽 saveConversationToConversationHistory');
  }

  async loadConversationFromConversationHistory(
    characterId: number
  ): Promise<any> {
    await this.initializeDB();
    if (this.db == null) {
      throw new Error('Database is not initialized.');
    }
    const result = await this.db.getAllAsync(
      'SELECT * FROM conversation_history WHERE character_id = ? ORDER BY date_sent ASC',
      characterId
    );
    console.log('💽 loadConversationFromConversationHistory');
    return result;
  }

  async saveCurrentDialogueNodeProgress(
    characterId: number,
    dialogueId: string
  ): Promise<any> {
    await this.initializeDB();
    if (this.db == null) {
      throw new Error('Database is not initialized.');
    }
    const result = await this.db.runAsync(
      'INSERT INTO current_conversation_state (character_id, dialogue_id) VALUES (?, ?)',
      characterId,
      dialogueId
    );
    console.log('💽 saveCurrentDialogueNodeProgress', result);
  }

  async getCurrentDialogueNodeProgress(characterId: number): Promise<any> {
    await this.initializeDB();
    if (this.db == null) {
      throw new Error('Database is not initialized.');
    }
    const result = await this.db.getFirstAsync(
      'SELECT * FROM dialogues INNER JOIN current_conversation_state ON dialogues.id = current_conversation_state.dialogue_id WHERE current_conversation_state.character_id = ?',
      characterId
    );
    console.log('💽 getCurrentDialogueNodeProgress', result);
    return result;
  }

  async getDialoguesOfId(dialoguesId: number[]): Promise<any> {
    // TODO
    return [];
  }
}

export default SQLiteService;
