import { Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

const ARSceneNavigator = () => {
  return (
    <View style={styles.centeredContainer}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Text>La réalité augmentée n&apos;est pas disponible sur navigateur</Text>
    </View>
  );
};

export default ARSceneNavigator;

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    verticalAlign: 'middle',
    textAlign: 'center',
  },
});
