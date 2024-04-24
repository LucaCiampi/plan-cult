import {
  ViroARImageMarker,
  ViroARScene,
  ViroARSceneNavigator,
  ViroARTrackingTargets,
  ViroBox,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from '@viro-community/react-viro';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const HelloWorldSceneAR = () => {
  const [text, setText] = useState('Initializing AR...');

  function onInitialized(
    state: ViroTrackingStateConstants,
    reason: ViroTrackingReason
  ) {
    console.log('🥽 onInitialized', state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText('Hello World!');
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
      console.warn('🥽 ViroTrackingStateConstants.TRACKING_UNAVAILABLE');
    }
  }

  ViroARTrackingTargets.createTargets({
    statue: {
      source: require('@/assets/experiences/statue.jpg'),
      orientation: 'Up',
      physicalWidth: 0.16,
      type: 'Image',
    },
  });

  const anchorFound = () => {
    console.log('🥽 anchorFound');
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroARImageMarker target={'statue'} onAnchorFound={anchorFound}>
        <ViroText
          text={text}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, 0.5]}
          style={styles.helloWorldTextStyle}
        />
        <ViroBox position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} />
      </ViroARImageMarker>
    </ViroARScene>
  );
};

const ARSceneNavigator = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        style={styles.container}
      />
    </View>
  );
};

export default ARSceneNavigator;

const styles = StyleSheet.create({
  container: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
