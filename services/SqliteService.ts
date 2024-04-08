import * as SQLite from 'expo-sqlite/next';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Config from '@/constants/Config';
import { Platform } from 'react-native';
import { fetchDataFromStrapi } from '@/utils/strapiUtils';

class SQLiteService implements IDatabaseService {
  public db: SQLite.SQLiteDatabase | null = null;

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
    console.log('💽 getAllCharacters');
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
    console.log('💽 getAllLikedCharacters');
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
    const result = await this.db.runAsync(
      'INSERT INTO conversation_history (character_id, date_sent, from_user, message) VALUES (?, ?, ?, ?)',
      characterId,
      currentDate.toString(),
      fromUser,
      message.toString()
    );
    console.log('💽 saveConversationToConversationHistory');
    return result;
  }

  // TODO: change promise to "Message[]"
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
    dialogueId: string,
    followingDialoguesId: number[]
  ): Promise<void> {
    await this.initializeDB();
    if (this.db == null) {
      throw new Error('Database is not initialized.');
    }
    const result = await this.db.runAsync(
      'UPDATE current_conversation_state SET dialogue_id = ?, following_dialogues_id = ? WHERE character_id = ?',
      dialogueId,
      JSON.stringify(followingDialoguesId),
      characterId
    );
    console.log('💽 saveCurrentDialogueNodeProgress', result.changes);
  }

  async getCurrentDialogueNodeProgress(
    characterId: number
  ): Promise<Dialogue[]> {
    await this.initializeDB();
    if (this.db == null) {
      throw new Error('Database is not initialized.');
    }
    const result = await this.db.getFirstAsync(
      'SELECT following_dialogues_id FROM current_conversation_state where character_id = ?',
      characterId
    );
    const followingDialoguesId: number[] = JSON.parse(
      (result as CurrentConversationState).following_dialogues_id
    ).map(Number);
    const dialogues = await this.getDialoguesOfId(followingDialoguesId);
    console.log('💽 getCurrentDialogueNodeProgress');
    return dialogues;
  }

  async getDialoguesOfId(dialoguesId: number[]): Promise<Dialogue[]> {
    // TODO: iOS does not allow HTTP requests by default, see info.plist
    // TODO: store all of the dialogues in local DB only once
    const filters = dialoguesId
      .map((id, index) => `filters[id][$in][${index}]=${id}`)
      .join('&');
    // TODO: do not populate "character"
    const endpoint = `dialogues?populate=*&${filters}`;
    console.log('💽 getDialoguesOfId :', dialoguesId);
    return await fetchDataFromStrapi(endpoint);
  }
}

export default SQLiteService;
