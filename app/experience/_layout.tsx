import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function ExperienceLayout() {
  return (
    <View style={styles.container}>
      <Stack />
      <Link style={styles.endExperienceButton} href={'/chat/'}>
        Quitter
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  endExperienceButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontSize: 16,
  },
});
