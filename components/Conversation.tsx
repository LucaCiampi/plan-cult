// Assurez-vous d'avoir l'interface Message correctement définie et importée
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { selectConversations } from '@/features/chat/chatSlice';
import Colors from '@/constants/Colors';
import { RootState } from '@/app/store';

const Conversation = ({ characterId }: { characterId: string }) => {
  // Assurez-vous que selectConversations est utilisé correctement selon sa définition
  const conversation = useSelector((state) =>
    selectConversations(state as RootState, characterId)
  );

  console.log('conversation', conversation);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [conversation]);

  return (
    <ScrollView ref={scrollViewRef}>
      {conversation?.map((message: Message, index: number) => (
        <View
          key={index} // Ajustez cela pour utiliser un identifiant unique si disponible
          style={[
            styles.message,
            message.sender === 'user'
              ? styles.userMessage
              : styles.characterMessage,
          ]}
        >
          <Text>{message.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

// Styles ajustés pour inclure les couleurs correctes pour le texte
const styles = StyleSheet.create({
  message: {
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.secondary,
    color: 'white', // Assurez-vous que cette couleur est définie dans votre objet Colors
  },
  characterMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    color: 'black', // La couleur du texte doit être définie ici, pas dans la section backgroundColor
  },
});

export default Conversation;
