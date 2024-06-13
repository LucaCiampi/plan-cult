import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import DatePlaceholderLine from '@/assets/placeholders/date-line.svg';
import Sizes from '@/constants/Sizes';

export default function Page() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Rencards cult'",
        }}
      />
      {Array.from({ length: 10 }).map((_, index) => (
        <DatePlaceholderLine key={index} />
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
});
