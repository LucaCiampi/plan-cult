import { useEffect } from "react";
import { View, Text } from "react-native";
import * as SQLite from "expo-sqlite";
import { Link } from "expo-router";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

// Ajoutez un flag de débogage
const DEBUG_MODE = true; // Mettez à false pour la production

export default function Page() {
  useEffect(() => {
    prepareDatabase();
  }, []);

  async function prepareDatabase() {
    const databaseFilename = "db.db";
    const internalDbName = `${FileSystem.documentDirectory}SQLite/${databaseFilename}`;

    // En mode de débogage, toujours recopier la base de données
    if (DEBUG_MODE) {
      console.log(
        "Mode de débogage actif : Recopie systématique de la base de données."
      );
      const asset = Asset.fromModule(require("../assets/databases/db.db"));
      await FileSystem.downloadAsync(asset.uri, internalDbName);
    } else {
      // En mode normal, vérifier si la base de données doit être copiée
      const fileInfo = await FileSystem.getInfoAsync(internalDbName);
      if (!fileInfo.exists) {
        console.log("Copie de la base de données dans le stockage interne.");
        const asset = Asset.fromModule(require("../assets/databases/db.db"));
        await FileSystem.downloadAsync(asset.uri, internalDbName);
      }
    }

    const db = SQLite.openDatabase(databaseFilename);
    retrieveAllFromDatabaseTable(db);
    listDatabaseTables(db);
  }

  return (
    <View>
      <Text>Index / onboarding</Text>
      <Link href="/map">Map</Link>
      <Link href="/">Swipe</Link>
      <Link href="/chat">Chat</Link>
    </View>
  );
}

function retrieveAllFromDatabaseTable(db: SQLite.Database) {
  db.transaction((tx: SQLite.SQLTransaction) => {
    tx.executeSql(
      "SELECT * FROM CHARACTERS",
      [],
      (_, result: SQLite.SQLResultSet) => console.log(result.rows._array),
      (_, err: SQLite.SQLError | null): boolean => {
        console.error(err);
        return false;
      }
    );
  });
}

function listDatabaseTables(db: SQLite.Database) {
  db.transaction((tx: SQLite.SQLTransaction) => {
    tx.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table'",
      [],
      (_, { rows: { _array } }) => console.log("Tables:", _array),
      (_, err: SQLite.SQLError | null) => {
        console.error("Erreur lors de la liste des tables:", err);
        return false;
      }
    );
  });
}
