import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

export default function SingleExperiencePage() {
  const { id } = useLocalSearchParams();

  const dbService = useDatabaseService();
  const [experience, setExperience] = useState<Experience | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const experience = await dbService.getExperienceOfId(Number(id));
        setExperience(experience);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Expérience ${id?.toString()}`,
          headerBackTitle: 'Retour',
        }}
      />
      {experience?.steps?.map((step) => (
        <View key={step.id}>
          <Text>{step.image?.data.attributes.url}</Text>
          <Text>{step.title}</Text>
          <Text>{step.text}</Text>
        </View>
      ))}
      <Link href={'/chat/'}>Fin</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
});
