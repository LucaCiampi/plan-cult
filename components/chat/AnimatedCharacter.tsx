import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import handReference from '@/assets/images/hand.png';
import edouardHerriotReference from '@/assets/images/edouard-herriot.png';
import { selectSpeakingState } from '@/slices/chatSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

interface Props {
  characterId: string;
}

const AnimatedCharacter = ({ characterId }: Props) => {
  // const [isTalking] = useState(true);
  const currentCharacterSpeakingState = useSelector((state) =>
    selectSpeakingState(state as RootState, characterId)
  );

  useEffect(() => {
    console.log('currentCharacterSpeakingState', currentCharacterSpeakingState);
  }, [currentCharacterSpeakingState]);

  return (
    <View style={styles.view}>
      <Image
        style={[
          styles.hand,
          currentCharacterSpeakingState === 1 && styles.isTalking,
        ]}
        source={handReference}
        alt="Hand"
      />
      <Image
        style={styles.character}
        source={edouardHerriotReference}
        alt="Character photo"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    position: 'relative',
    // backgroundColor: 'red',
  },
  hand: {
    height: 190,
    width: 132,
    position: 'absolute',
    left: '65%',
    bottom: -90,
    transform: [{ rotate: '0deg' }],
    transformOrigin: '25% 25%',
    // backgroundColor: 'green',
    // zIndex: 22,
  },
  isTalking: {
    transform: [{ rotate: '-110deg' }],
  },
  character: {
    left: 0,
    bottom: 0,
    width: 150,
    height: 250,
    // opacity: 0,
  },
});

export default AnimatedCharacter;
