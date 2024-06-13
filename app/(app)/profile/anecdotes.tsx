import { Stack } from 'expo-router';
import { StyleSheet, ScrollView } from 'react-native';
import AnecdotePlaceholderLine from '@/assets/placeholders/anecdote-line.svg';
import Sizes from '@/constants/Sizes';

export default function Page() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Fun facts',
        }}
      />
      {Array.from({ length: 10 }).map((_, index) => (
        <AnecdotePlaceholderLine key={index} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Sizes.pageContentHorizontalMargin,
    paddingVertical: Sizes.pageContentVerticalMargin,
    rowGap: Sizes.padding,
  },
});
