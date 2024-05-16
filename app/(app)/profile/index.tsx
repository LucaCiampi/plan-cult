import UserProfileHeader from '@/components/userProfile/UserProfileHeader';
import UserProfileButton from '@/components/userProfile/UserProfileButton';
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
      <View style={styles.buttons}>
        <UserProfileButton text="Anecdotes" link="/profile/anecdotes" />
        <UserProfileButton
          color="purple"
          text="Trophées"
          link="/profile/trophies"
        />
        <UserProfileButton
          color="purple"
          text="Anecdotes"
          link="/profile/anecdotes"
        />
        <UserProfileButton text="Trophées" link="/profile/trophies" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Sizes.pageContentHorizontalMargin,
    marginVertical: Sizes.pageContentVerticalMargin,
    gap: Sizes.padding,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.padding,
  },
});
