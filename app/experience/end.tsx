import Button from '@/components/common/Button';
import CharacterTag from '@/components/map/CharacterTag';
import Sizes from '@/constants/Sizes';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import HeartAnim from '@/assets/images/heart-anim.gif';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { useCallback, useEffect, useState } from 'react';
import SucessSound from '@/assets/sounds/success.m4a';

const ARSceneNavigator = () => {
  const [sound, setSound] = useState<Audio.Sound>();

  const playSuccessSound = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const { sound } = await Audio.Sound.createAsync(SucessSound);
    setSound(sound);
    await sound.playAsync();
  }, [sound]);

  useEffect(() => {
    console.log('sound');

    void playSuccessSound();
  }, []);

  useEffect(() => {
    return sound !== undefined
      ? () => {
          void sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.centeredContainer}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Image
        style={{
          width: 400,
          height: 400,
          position: 'absolute',
          zIndex: 5,
        }}
        contentFit="cover"
        source={HeartAnim}
      />
      <Text style={styles.text}>Ton niveau de confiance a augmenté avec</Text>
      <CharacterTag characterId={5} />
      <Text style={styles.text}>De nouveaux dialogues sont apparus.</Text>
      <Button style={styles.button} fontSize="large" color="purple">
        <Link href={'/chat/'}>Compris</Link>
      </Button>
    </View>
  );
};

export default ARSceneNavigator;

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Sizes.pageContentHorizontalMargin,
    paddingVertical: Sizes.pageContentVerticalMargin,
  },
  text: {
    fontSize: Sizes.subtitleFontSize,
    fontFamily: 'FreightSansProMediumBold',
    textAlign: 'center',
    margin: Sizes.padding,
  },
  button: {
    position: 'absolute',
    bottom: Sizes.padding * 4,
    paddingHorizontal: Sizes.padding * 2,
    paddingVertical: 8,
  },
});
