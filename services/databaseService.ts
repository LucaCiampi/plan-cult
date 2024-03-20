import * as SQLite from "expo-sqlite/next";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

export async function prepareDatabase(debugMode: boolean) {
  const databaseFilename = "db.db";
  const internalDbName = `${FileSystem.documentDirectory}SQLite/${databaseFilename}`;

  if (debugMode) {
    console.log("Mode débogage : recopie systématique de la base de données.");
    const asset = Asset.fromModule(require("../assets/databases/db.db"));
    await FileSystem.downloadAsync(asset.uri, internalDbName);
  } else {
    const fileInfo = await FileSystem.getInfoAsync(internalDbName);
    if (!fileInfo.exists) {
      console.log("Copie de la base de données dans le stockage interne.");
      const asset = Asset.fromModule(require("../assets/databases/db.db"));
      await FileSystem.downloadAsync(asset.uri, internalDbName);
    }
  }

  return SQLite.openDatabaseAsync(databaseFilename);
}

export async function retrieveAllFromDatabaseTable(
  db: SQLite.SQLiteDatabase
): Promise<Character[]> {
  const allRows = await db.getAllAsync("SELECT * FROM CHARACTERS");
  return allRows as Character[];
}

export async function listDatabaseTables(db: SQLite.SQLiteDatabase) {
  const allRows = await db.getAllAsync(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );
  return allRows;
}
