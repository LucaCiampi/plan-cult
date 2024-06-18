import { Link } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import PresentateurImage from '@/assets/images/onboarding/presentateur-4.png';
import AnecdotesMessage from '@/assets/images/onboarding/anecdotes.png';
import Button from '@/components/common/Button';
import Sizes from '@/constants/Sizes';

export default function Page() {
  return (
    <View style={styles.onboardingView}>
      <Image
        style={styles.message}
        contentFit="contain"
        source={AnecdotesMessage}
      />
      <Image
        style={styles.presentateur}
        contentFit="contain"
        source={PresentateurImage}
      />
      <Button fontSize="large" color="purple" style={styles.bottomButton}>
        <Link href={'/onboarding/5'}>Stylé</Link>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  onboardingView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: {
    position: 'absolute',
    height: 248,
    width: 328,
    bottom: '45%',
  },
  presentateur: {
    position: 'absolute',
    bottom: -40,
    right: 0,
    width: '100%',
    aspectRatio: 0.92,
  },
  bottomButton: {
    position: 'absolute',
    bottom: Sizes.padding * 4,
    paddingHorizontal: Sizes.padding * 2,
    paddingVertical: 8,
  },
});
