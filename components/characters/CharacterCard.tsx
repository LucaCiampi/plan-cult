// CharacterCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Config from '@/constants/Config';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import Sizes from '@/constants/Sizes';
import { Stack } from 'expo-router';

interface CharacterProps {
  character: Character;
  isCurrent: boolean;
}

const CharacterCard: React.FC<CharacterProps> = ({ character, isCurrent }) => {
  return (
    <View style={[styles.characterCard, isCurrent && styles.isCurrent]}>
      <Stack.Screen
        options={{
          headerTitle: `${character.name} ${character.surname}`,
        }}
      />
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
        </View>
        {character.profile?.map((profileSection, index) =>
          renderProfileSection(profileSection, index)
        )}
      </View>
    </View>
  );
};

const renderProfileSection = (
  profileSection: CharacterProfileSection,
  index: number
) => {
  // Préparation du titre
  const titleElement = profileSection.profile_prompt_title?.data?.attributes
    ?.title != null && (
    <Text key={index + '-title'} style={styles.sectionPromptTitle}>
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
        <Text key={index + '-answer'} style={styles.textSection}>
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
    default:
      content = null;
  }

  // Retourne le titre (si présent) et le contenu spécifique
  return (
    <View style={styles.section} key={index}>
      {titleElement}
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  characterCard: {
    flex: 1,
    paddingHorizontal: Sizes.pageContentHorizontalMargin,
    paddingVertical: Sizes.pageContentVerticalMargin,
    position: 'absolute',
    opacity: 0,
    marginBottom: Sizes.padding * 6,
  },
  isCurrent: {
    position: 'static',
    opacity: 1,
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
    paddingHorizontal: 16,
    paddingVertical: 18,
    paddingBottom: 0,
  },
  textSection: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  characterName: {
    fontSize: Sizes.subtitleFontSize,
    fontWeight: 'bold',
    fontFamily: 'ITCAvantGardeMd',
  },
  characterDescription: {
    fontSize: Sizes.regularFontSize,
  },
});

export default CharacterCard;
