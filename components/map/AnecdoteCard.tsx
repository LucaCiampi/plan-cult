// AnecdoteCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';

interface AnecdoteCardProps {
  anecdote: Anecdote;
}

const AnecdoteCard: React.FC<AnecdoteCardProps> = ({ anecdote }) => {
  return (
    <View style={styles.card}>
      {/* <Image
        // TODO: manifestement les images fetchées ne sont pas celles en local
        source={{ uri: anecdote.thumbnail }}
        style={styles.anecdoteMainPhoto}
      /> */}
      <Text style={styles.anecdoteTitle}>{anecdote.title}</Text>
      <Text style={styles.anecdoteDescription}>{anecdote.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Sizes.pageContentHorizontalMargin * 1.5,
    flex: 1,
    gap: Sizes.padding,
  },
  anecdoteMainPhoto: {
    width: '100%',
    // TODO: auto aspect-ratio
    aspectRatio: 1,
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
