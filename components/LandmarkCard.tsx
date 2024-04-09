import { View, Text, StyleSheet } from 'react-native';

interface ConversationProps {
  landmark: Landmark;
}

const LandmarkCard = ({ landmark }: ConversationProps) => {
  return (
    <View>
      <Text style={styles.title}>coucou</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
  },
});

export default LandmarkCard;
