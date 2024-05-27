// CharacterTag.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';
import Avatar from '@/components/common/Avatar';

interface CharacterTagProps {
  character: Character;
}

const CharacterTag: React.FC<CharacterTagProps> = ({ character }) => {
  return (
    <View style={styles.nameContainer}>
      <Avatar size="large" src={character.avatar_url} />
      <Text style={styles.name}>
        {character.name} {character.surname}
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
