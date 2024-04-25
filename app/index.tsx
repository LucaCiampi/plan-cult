import Button from '@/components/common/Button';
import Sizes from '@/constants/Sizes';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return <Redirect href={'/(app)/swipe'} />;
  }

  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.title}>Onboarding</Text>
      <Text style={styles.content}>
        Vous allez maintenant être mis en relation avec ceux qui ont façonné
        l&apos;histoire de Lyon
      </Text>
      <Text style={styles.content}>Sortez votre meilleure tchatche</Text>
      <View style={styles.buttonWrapper}>
        <Button
          onPress={() => {
            setIsLoaded(true);
          }}
        >
          Roule ma poule
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: Sizes.padding,
    paddingHorizontal: Sizes.pageContentHorizontalMargin,
    paddingVertical: Sizes.pageContentVerticalMargin,
  },
  title: {
    fontSize: Sizes.subtitleFontSize,
    fontFamily: 'ITCAvantGardeMd',
    textAlign: 'center',
    marginBottom: Sizes.padding * 2,
  },
  content: {
    fontSize: Sizes.regularFontSize,
    fontFamily: 'ITCAvantGardeMd',
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '50%',
    alignSelf: 'center',
    marginTop: Sizes.padding * 2,
  },
});
