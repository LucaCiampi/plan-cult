// CharacterTag.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';
import Avatar from '@/components/common/Avatar';
import { selectCharacterOfId } from '@/slices/charactersSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

interface CharacterTagProps {
  characterId: number;
}

const CharacterTag: React.FC<CharacterTagProps> = ({ characterId }) => {
  const currentCharacter = useSelector((state) =>
    selectCharacterOfId(state as RootState, characterId)
  );

  return (
    <View style={styles.nameContainer}>
      <Avatar size="large" src={currentCharacter?.avatar_url} />
      <Text style={styles.name}>
        {currentCharacter?.name} {currentCharacter?.surname}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    backgroundColor: Colors.black,
    padding: 4,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.padding,
  },
  name: {
    fontSize: Sizes.subtitleFontSize,
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default CharacterTag;
