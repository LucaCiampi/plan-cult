import { Stack } from 'expo-router';
import { StyleSheet, ScrollView, View } from 'react-native';
import DicoPlaceholderLine1 from '@/assets/placeholders/dico-line-1.svg';
import DicoPlaceholderLine2 from '@/assets/placeholders/dico-line-2.svg';
import DicoPlaceholderLine3 from '@/assets/placeholders/dico-line-3.svg';
import Sizes from '@/constants/Sizes';

export default function Page() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen
        options={{
          headerTitle: "Le dico'",
          headerBackTitle: 'Retour',
        }}
      />
      <View style={styles.line}>
        <DicoPlaceholderLine1 />
      </View>
      <View style={styles.line}>
        <DicoPlaceholderLine2 />
      </View>
      <View style={styles.line}>
        <DicoPlaceholderLine3 />
      </View>
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
