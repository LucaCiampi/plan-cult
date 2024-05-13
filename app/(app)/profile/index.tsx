import UserProfileHeader from '@/components/userProfile/UserProfileHeader';
import Sizes from '@/constants/Sizes';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function Page() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <UserProfileHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Sizes.pageContentHorizontalMargin,
    marginVertical: Sizes.pageContentVerticalMargin,
  },
});
