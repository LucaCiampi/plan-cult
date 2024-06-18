import { Stack } from 'expo-router';
import { StyleSheet, ScrollView, View } from 'react-native';
import AnecdotePlaceholderLine from '@/assets/placeholders/anecdote-line.svg';
import Sizes from '@/constants/Sizes';

export default function Page() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen
        options={{
          headerTitle: 'Fun facts',
          headerBackTitle: 'Retour',
        }}
      />
      {Array.from({ length: 1 }).map((_, index) => (
        <View key={index} style={styles.line}>
          <AnecdotePlaceholderLine key={index} />
        </View>
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
    margin: 'auto',
  },
  contentContainer: {
    flexGrow: 1,
    gap: 6,
  },
  line: {
    marginHorizontal: 'auto',
  },
});
