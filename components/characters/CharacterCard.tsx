// CharacterCard.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Config from '@/constants/Config';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import Sizes from '@/constants/Sizes';

interface CharacterProps {
  character: Character;
  isCurrent: boolean;
}

const CharacterCard: React.FC<CharacterProps> = ({ character, isCurrent }) => {
  const characterCardStyle = useMemo(
    () => [styles.characterCard, isCurrent && styles.isCurrent],
    [isCurrent]
  );

  return (
    <View style={characterCardStyle}>
      <View style={styles.characterCardContent}>
        <View style={styles.section}>
          <Image
            // TODO: manifestement les images fetchées ne sont pas celles en local
            source={{ uri: character.avatar_url }}
            style={styles.profilePhoto}
            contentFit="cover"
          />
          <View style={styles.characterProfileBio}>
            <Text style={styles.characterName}>
              {character.name} {character.surname}
            </Text>
            {Boolean(character.birth) && (
              <Text style={styles.characterDescription}>{character.birth}</Text>
            )}
          </View>
        </View>
        {character.profile?.map((profileSection, index) => (
          <ProfileSection
            key={index}
            profileSection={profileSection}
            index={index}
          />
        ))}
      </View>
    </View>
  );
};

const getSectionStyles = (componentType: string) => {
  switch (componentType) {
    case 'profile.text-prompt':
      return { backgroundColor: Colors.yellow };
    default:
      return {};
  }
};

const ProfileSection: React.FC<{
  profileSection: CharacterProfileSection;
  index: number;
}> = ({ profileSection, index }) => {
  // Préparation du titre
  const titleElement = profileSection.profile_prompt_title?.data?.attributes
    ?.title != null && (
    <Text key={index + '-title'} style={styles.sectionPromptTitle}>
      {profileSection.profile_prompt_title.data.attributes.title}
    </Text>
  );

  // Génération du contenu spécifique basé sur le __component
  const content = useMemo(() => {
    switch (profileSection.__component) {
      case 'profile.photo':
        return (
          <Image
            key={index}
            source={{
              uri:
                Config.STRAPI_DOMAIN_URL +
                profileSection.image?.data?.attributes?.url,
            }}
            style={[styles.profilePhoto, { aspectRatio: 1 }]}
          />
        );
      case 'profile.text-prompt':
        return (
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
      default:
        return null;
    }
  }, [profileSection]);

  // Styles conditionnels pour la section
  const sectionStyle = useMemo(
    () => [styles.section, getSectionStyles(profileSection.__component)],
    [profileSection.__component]
  );

  // Retourne le titre (si présent) et le contenu spécifique
  return (
    <View style={sectionStyle} key={index}>
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
  section: {
    borderRadius: Sizes.borderRadius,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    gap: Sizes.padding,
  },
  characterProfileBio: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.black + '88',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'FreightSansProMediumRegular',
  },
  characterCardContent: {
    flex: 1,
    gap: Sizes.padding,
  },
  profilePhoto: {
    flex: 1,
    width: '100%',
    // TODO: auto aspect-ratio
    aspectRatio: 0.68,
    marginVertical: -10,
  },
  sectionPromptTitle: {
    // TODO: pas pris en compte
    fontSize: Sizes.subtitleFontSize,
    fontFamily: 'FreightSansProMediumBold',
    paddingHorizontal: 16,
    paddingVertical: 18,
    paddingBottom: 8,
  },
  textSection: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    fontFamily: 'FreightSansProMediumRegular',
  },
  characterName: {
    fontSize: Sizes.subtitleFontSize,
    fontWeight: 'bold',
    fontFamily: 'FreightSansProMediumBold',
    color: Colors.white,
  },
  characterDescription: {
    fontSize: Sizes.regularFontSize,
    color: Colors.white,
  },
});

export default CharacterCard;
