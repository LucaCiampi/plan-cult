import { View, Text, FlatList, StyleSheet } from "react-native";
import Button from "../components/common/Button";
import { useEffect, useState } from "react";
import {
  prepareDatabase,
  retrieveAllFromDatabaseTable,
} from "@/services/databaseService";

export default function Page() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    async function fetchData() {
      const db = await prepareDatabase(true);
      const charactersData = await retrieveAllFromDatabaseTable(db);
      setCharacters(charactersData as Character[]);
    }
    fetchData();
  }, []);

  return (
    <View>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.characterContainer}>
            <Text style={styles.characterName}>
              {item.name} {item.surname}
            </Text>
            {item.birth && (
              <Text style={styles.characterDescription}>{item.birth}</Text>
            )}
            <View style={styles.buttonsContainer}>
              <Button style={styles.button}>Dislike</Button>
              <Button style={styles.button}>Like</Button>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  characterContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  characterName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  characterDescription: {
    fontSize: 14,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 24,
  },
  button: {
    flex: 1,
  },
});
