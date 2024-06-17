import { Link } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import PresentateurImage from '@/assets/images/onboarding/presentateur-2.png';
import PresentationMessage from '@/assets/images/onboarding/presentation.png';
import Button from '@/components/common/Button';
import Sizes from '@/constants/Sizes';

export default function Page() {
  return (
    <View style={styles.onboardingView}>
      <Image
        style={styles.welcome}
        contentFit="contain"
        source={PresentationMessage}
      />
      <Image
        style={styles.presentateur}
        contentFit="contain"
        source={PresentateurImage}
      />
      <Button fontSize="large" color="purple" style={styles.bottomButton}>
        <Link href={'/onboarding/3'}>Enchanté</Link>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  onboardingView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcome: {
    position: 'absolute',
    top: Sizes.padding * 5,
    height: 258,
    width: 308,
    zIndex: 2,
  },
  presentateur: {
    position: 'absolute',
    bottom: -30,
    right: 0,
    height: 500,
    aspectRatio: 0.6,
  },
  bottomButton: {
    position: 'absolute',
    bottom: Sizes.padding * 4,
    paddingHorizontal: Sizes.padding * 2,
    paddingVertical: 8,
  },
});
