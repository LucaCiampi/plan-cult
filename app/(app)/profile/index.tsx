import UserProfileHeader from '@/components/userProfile/UserProfileHeader';
import UserProfileButton from '@/components/userProfile/UserProfileButton';
import Sizes from '@/constants/Sizes';
import { Stack, router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
        <TouchableOpacity
          style={styles.singleButton}
          onPress={() => {
            router.push('/profile/anecdotes');
          }}
        >
          <UserProfileButton text="Anecdotes" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.singleButton}
          onPress={() => {
            router.push('/profile/trophies');
          }}
        >
          <UserProfileButton color="purple" text="Trophées" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.singleButton}
          onPress={() => {
            router.push('/profile/anecdotes');
          }}
        >
          <UserProfileButton color="purple" text="Anecdotes" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.singleButton}
          onPress={() => {
            router.push('/profile/trophies');
          }}
        >
          <UserProfileButton text="Trophées" />
        </TouchableOpacity>
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
  singleButton: {
    flex: 1,
    flexBasis: 120,
  },
});
