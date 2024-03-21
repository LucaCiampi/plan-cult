import * as SQLite from 'expo-sqlite/next';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Config from '@/constants/Config';

export async function prepareDatabase() {
  const databaseFilename = 'db.db';
  const documentsDirectory = FileSystem.documentDirectory;
  const sqlLiteDirectory = `${documentsDirectory}SQLite/`;
  const internalDbName = `${sqlLiteDirectory}${databaseFilename}`;

  // Vérifier et créer le répertoire SQLite si nécessaire
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
      console.log(`Téléchargement réussi : ${JSON.stringify(downloadResult)}`);
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

export async function retrieveAllFromDatabaseTable(
  db: SQLite.SQLiteDatabase
): Promise<Character[]> {
  const allRows = await db.getAllAsync('SELECT * FROM CHARACTERS');
  return allRows as Character[];
}

export async function listDatabaseTables(db: SQLite.SQLiteDatabase) {
  const allRows = await db.getAllAsync(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );
  return allRows;
}
