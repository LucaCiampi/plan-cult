import * as SQLite from 'expo-sqlite/next';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Config from '@/constants/Config';
import SyncService from '@/services/SyncService';
import StrapiService from '@/services/StrapiService';

class SQLiteService implements IDatabaseService {
  public dbPromise: Promise<SQLite.SQLiteDatabase>;
  public isSyncComplete: boolean = false;
  private readonly strapiService: StrapiService;
  private readonly syncListeners: Array<() => void> = [];

  constructor() {
    this.dbPromise = this.initializeDB();
    this.strapiService = new StrapiService();
    this.syncWithStrapi(this.strapiService)
      .then(() => {
        this.isSyncComplete = true;
        this.notifySyncComplete();
      })
      .catch((error) => {
        console.error('Sync failed', error);
        this.isSyncComplete = false;
      });
  }

  private async syncWithStrapi(strapiService: StrapiService): Promise<void> {
    const syncService = new SyncService(this, strapiService);
    await syncService.syncAll();
  }

  private notifySyncComplete() {
    this.syncListeners.forEach((listener) => {
      listener();
    });
  }

  public onSyncComplete(listener: () => void) {
    if (this.isSyncComplete) {
      listener();
    } else {
      this.syncListeners.push(listener);
    }
  }

  async initializeDB(): Promise<SQLite.SQLiteDatabase> {
    console.log('Initializing DB');

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

    // const dbAsset = Asset.fromModule(require('../assets/databases/db.db'));
    const dbAsset = Asset.fromModule(
      require('@/assets/databases/db.db') as string
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
      return await SQLite.openDatabaseAsync(databaseFilename);
    } catch (error) {
      console.error(
        `Erreur lors de la préparation de la base de données : ${
          typeof error === 'string' ? error : JSON.stringify(error)
        }`
      );
      throw error; // Rethrow l'erreur pour indiquer un échec dans le flux d'exécution appelant.
    }
  }

  private async getDb(): Promise<SQLite.SQLiteDatabase> {
    return await this.dbPromise;
  }

  async getAllCharacters(): Promise<Character[]> {
    const db = await this.getDb();
    const allRows = await db.getAllAsync('SELECT * FROM CHARACTERS');
    console.log('💽 getAllCharacters');
    return allRows as Character[];
  }

  async getAllLikedCharacters(): Promise<Character[]> {
    const db = await this.getDb();
    const allRows = await db.getAllAsync(
      'SELECT * FROM CHARACTERS WHERE liked = 1'
    );
    console.log('💽 getAllLikedCharacters');
    return allRows as Character[];
  }

  // TODO
  async getCharacterProfile(characterId: number): Promise<Character> {
    return await this.strapiService.getCharacterProfile(characterId);
  }

  async saveConversationToConversationHistory(
    characterId: number,
    isSentByUser: boolean,
    message: string
  ): Promise<any> {
    const db = await this.getDb();
    const currentDate = new Date();
    const fromUser = isSentByUser ? 1 : 0;
    const result = await db.runAsync(
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
    const db = await this.getDb();
    const result = await db.getAllAsync(
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
    const db = await this.getDb();
    const result = await db.runAsync(
      'UPDATE current_conversation_state SET dialogue_id = ?, following_dialogues_id = ? WHERE character_id = ?',
      dialogueId,
      JSON.stringify(followingDialoguesId),
      characterId
    );
    console.log('💽 saveCurrentDialogueNodeProgress', result.changes);
  }

  async getCurrentConversationStateWithCharacter(
    characterId: number
  ): Promise<Dialogue[]> {
    const db = await this.getDb();
    const result = await db.getFirstAsync(
      'SELECT following_dialogues_id FROM current_conversation_state WHERE character_id = ?',
      characterId
    );
    const followingDialoguesId: number[] = JSON.parse(
      (result as CurrentConversationState).following_dialogues_id
    ).map(Number);
    const dialogues = await this.getDialoguesOfId(followingDialoguesId);
    console.log('💽 getCurrentConversationStateWithCharacter', dialogues);
    return dialogues;
  }

  async getFirstDialoguesOfTrustLevel(
    characterId: number,
    trustLevel: number
  ): Promise<Dialogue[]> {
    const db = await this.getDb();
    console.log('getFirstDialoguesOfTrustLevel(', characterId, trustLevel, ')');

    const result = await db.getFirstAsync(
      'SELECT dialogues_id FROM dialogue_anchor WHERE character_id = ? AND trust_level = ?',
      characterId,
      trustLevel
    );

    const followingDialoguesId: number[] = JSON.parse(
      (result as DialogueAnchor).dialogues_id
    ).map(Number);
    return await this.getDialoguesOfId(followingDialoguesId);
  }

  async getAllDialogueAnchors(): Promise<DialogueAnchor[]> {
    // TODO
    return await this.strapiService.getAllDialogueAnchors();
  }

  async getAllDialogueAnchorsOfTrustLevel(
    trustLevel: number
  ): Promise<DialogueAnchor[]> {
    // TODO
    const db = await this.getDb();
    const dialoguesAnchorsOfTrustLevel = await db.getAllAsync(
      'SELECT * FROM dialogue_anchor WHERE trust_level = ?',
      trustLevel
    );
    return dialoguesAnchorsOfTrustLevel as DialogueAnchor[];
  }

  async getDialoguesOfId(dialoguesId: number[]): Promise<Dialogue[]> {
    // TODO
    return await this.strapiService.getDialoguesOfId(dialoguesId);
  }

  async getAllLandmarks(): Promise<Landmark[]> {
    // TODO
    return await this.strapiService.getAllLandmarks();
  }

  async getExperienceOfId(experienceId: number): Promise<Experience> {
    return await this.strapiService.getExperienceOfId(experienceId);
  }
}

export default SQLiteService;
