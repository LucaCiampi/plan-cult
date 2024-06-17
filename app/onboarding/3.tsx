import { Link } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import PresentateurImage from '@/assets/images/onboarding/presentateur-3.png';
import PrincipeMessage from '@/assets/images/onboarding/principe.png';
import PersonnagesMessage from '@/assets/images/onboarding/personnages.png';
import Button from '@/components/common/Button';
import Sizes from '@/constants/Sizes';

export default function Page() {
  return (
    <View style={styles.onboardingView}>
      <Image
        style={styles.welcome}
        contentFit="contain"
        source={PrincipeMessage}
      />
      <Image
        style={styles.personnagesMessage}
        contentFit="contain"
        source={PersonnagesMessage}
      />
      <Image
        style={styles.presentateur}
        contentFit="contain"
        source={PresentateurImage}
      />
      <Button fontSize="large" color="purple" style={styles.bottomButton}>
        <Link href={'/onboarding/4'}>Compris</Link>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  onboardingView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcome: {
    position: 'absolute',
    top: '6%',
    height: 218,
    width: 228,
    zIndex: 3,
  },
  personnagesMessage: {
    position: 'absolute',
    bottom: '26%',
    height: 318,
    width: 298,
    zIndex: 2,
  },
  presentateur: {
    position: 'absolute',
    bottom: -30,
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
