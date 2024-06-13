import UserProfileHeader from '@/components/userProfile/UserProfileHeader';
import UserProfileButton from '@/components/userProfile/UserProfileButton';
import Sizes from '@/constants/Sizes';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import DatesButton from '@/assets/images/profile/button-dates.png';
import DicoButton from '@/assets/images/profile/button-dico.png';
import FunFactsButton from '@/assets/images/profile/button-fun-facts.png';

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
        <UserProfileButton
          isLarge
          image={DatesButton}
          color="none"
          link="/profile/anecdotes"
        />
        <UserProfileButton
          isLarge
          image={DicoButton}
          color="none"
          link="/profile/anecdotes"
        />
        <UserProfileButton
          isLarge
          color="none"
          image={FunFactsButton}
          link="/profile/anecdotes"
        />
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
    flexDirection: 'column',
    // flexWrap: 'wrap',
    gap: Sizes.padding,
  },
});
