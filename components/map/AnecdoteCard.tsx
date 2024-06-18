// AnecdoteCard.tsx
import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';

interface AnecdoteCardProps {
  anecdote: Anecdote;
}

const AnecdoteCard: React.FC<AnecdoteCardProps> = ({ anecdote }) => {
  console.log(anecdote);

  return (
    <ScrollView style={styles.card}>
      <View style={styles.cardContent}>
        <Image
          // TODO: manifestement les images fetchées ne sont pas celles en local
          source={{ uri: anecdote.image }}
          style={styles.anecdoteMainPhoto}
        />
        <Text style={styles.anecdoteTitle}>{anecdote.title}</Text>
        <Text style={styles.anecdoteDescription}>{anecdote.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Sizes.pageContentHorizontalMargin * 1.5,
    flex: 1,
  },
  cardContent: {
    paddingBottom: Sizes.pageContentVerticalMargin * 4,
    gap: Sizes.padding,
  },
  anecdoteMainPhoto: {
    width: '100%',
    // TODO: auto aspect-ratio
    aspectRatio: 1.3,
    backgroundColor: Colors.grey,
  },
  anecdoteTitle: {
    fontSize: 24,
  },
  anecdoteDescription: {
    fontSize: 16,
  },
});

export default AnecdoteCard;
