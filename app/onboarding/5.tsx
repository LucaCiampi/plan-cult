import { Link } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import PresentateurImage from '@/assets/images/onboarding/presentateur-5.png';
import GeolocMessage from '@/assets/images/onboarding/geoloc.png';
import GeolocNoMessage from '@/assets/images/onboarding/geoloc-no.png';
import Button from '@/components/common/Button';
import Sizes from '@/constants/Sizes';

export default function Page() {
  return (
    <View style={styles.onboardingView}>
      <Image
        style={styles.message}
        contentFit="contain"
        source={GeolocMessage}
      />
      <Image
        style={styles.geolocNoMessage}
        contentFit="contain"
        source={GeolocNoMessage}
      />
      <Image
        style={styles.presentateur}
        contentFit="contain"
        source={PresentateurImage}
      />
      <View style={styles.bottomButtonsWrapper}>
        <Button fontSize="large" color="white" style={styles.bottomButton}>
          <Link href={'/swipe'}>Passer</Link>
        </Button>
        <Button fontSize="large" color="purple" style={styles.bottomButton}>
          <Link href={'/swipe'}>Roule ma poule</Link>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  onboardingView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: {
    position: 'absolute',
    width: 280,
    height: 260,
    top: '4%',
    zIndex: 3,
  },
  geolocNoMessage: {
    position: 'absolute',
    width: 200,
    height: 150,
    bottom: '35%',
    left: Sizes.padding,
    zIndex: 2,
  },
  presentateur: {
    position: 'absolute',
    bottom: -30,
    right: 0,
    height: 530,
    aspectRatio: 0.46,
  },
  bottomButtonsWrapper: {
    position: 'absolute',
    bottom: Sizes.padding * 4,
    flexDirection: 'column',
    gap: Sizes.padding,
  },
  bottomButton: {
    paddingHorizontal: Sizes.padding * 2,
    paddingVertical: 8,
  },
});
