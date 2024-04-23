import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function SingleExperiencePage() {
  const { id } = useLocalSearchParams();

  useEffect(() => {
    console.log('mounted');
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Expérience ${id.toString()}`,
          headerBackTitle: 'Retour',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
});
