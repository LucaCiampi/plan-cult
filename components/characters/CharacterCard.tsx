// CharacterCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Config from '@/constants/Config';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import Sizes from '@/constants/Sizes';
import LikeButton from '@/components/characters/LikeButton';

interface CharacterProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterProps> = ({ character }) => {
  console.log(character.avatar_url);

  return (
    <View style={styles.characterCard}>
      <View style={styles.characterCardContent}>
        <View style={styles.section}>
          <Image
            // TODO: manifestement les images fetchées ne sont pas celles en local
            source={{ uri: character.avatar_url }}
            style={styles.profilePhoto}
            contentFit="cover"
          />
          <View style={styles.textSection}>
            <Text style={styles.characterName}>
              {character.name} {character.surname}
            </Text>
            {Boolean(character.birth) && (
              <Text style={styles.characterDescription}>{character.birth}</Text>
            )}
          </View>
          <LikeButton characterId={character.id} />
        </View>
        {character.profile?.map((profileSection, index) =>
          renderProfileSection(profileSection, index, character.id)
        )}
      </View>
    </View>
  );
};

const renderProfileSection = (
  profileSection: CharacterProfileSection,
  index: number,
  characterId: number
) => {
  // Préparation du titre
  const titleElement = profileSection.profile_prompt_title?.data?.attributes
    ?.title != null && (
    <Text
      key={index + '-title'}
      style={[styles.sectionPromptTitle, styles.characterDescription]}
    >
      {profileSection.profile_prompt_title.data.attributes.title}
    </Text>
  );

  // Génération du contenu spécifique basé sur le __component
  let content;
  switch (profileSection.__component) {
    case 'profile.photo':
      content = (
        <Image
          key={index}
          source={{
            uri:
              Config.STRAPI_DOMAIN_URL +
              profileSection.image?.data?.attributes?.url,
          }}
          style={styles.profilePhoto}
        />
      );
      break;
    case 'profile.text-prompt':
      content = (
        <Text
          key={index + '-answer'}
          style={[styles.textSection, styles.characterDescription]}
        >
          {profileSection.answer?.map((answer, answerIndex) =>
            answer.children.map((answerChild, childIndex) => (
              <Text
                key={`${index}-${answerIndex}-${childIndex}-${answerChild.text}`}
              >
                {answerChild?.text}
              </Text>
            ))
          )}
        </Text>
      );
      break;
    // Ajoute d'autres cas ici selon les types de __component que tu as
    default:
      content = null;
  }

  // Retourne le titre (si présent) et le contenu spécifique
  return (
    <View style={styles.section} key={index}>
      {titleElement}
      {content}
      <LikeButton characterId={characterId} />
    </View>
  );
};

const styles = StyleSheet.create({
  characterCard: {
    flex: 1,
    paddingHorizontal: Sizes.pageContentHorizontalMargin,
    paddingVertical: Sizes.pageContentVerticalMargin,
  },
  characterCardContent: {
    flex: 1,
    gap: Sizes.padding,
  },
  profilePhoto: {
    flex: 1,
    width: '100%',
    // TODO: auto aspect-ratio
    aspectRatio: 1,
    backgroundColor: Colors.grey,
  },
  section: {
    borderRadius: Sizes.borderRadius,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    gap: Sizes.padding,
  },
  sectionPromptTitle: {
    // TODO: pas pris en compte
    fontSize: Sizes.subtitleFontSize,
    margin: Sizes.padding,
    marginBottom: 0,
  },
  textSection: {
    padding: Sizes.padding,
  },
  characterName: {
    fontSize: Sizes.subtitleFontSize,
    fontWeight: 'bold',
    fontFamily: 'ITCAvantGardeMd',
  },
  characterDescription: {
    fontSize: Sizes.regularFontSize,
  },
  likeButton: {},
});

export default CharacterCard;
