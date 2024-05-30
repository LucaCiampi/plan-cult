import {
  Viro3DObject,
  ViroARImageMarker,
  ViroARScene,
  ViroARSceneNavigator,
  ViroARTrackingTargets,
  ViroAmbientLight,
  ViroBox,
  ViroImage,
  ViroNode,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from '@viro-community/react-viro';
import React, { useEffect, useState } from 'react';
import bowlObject from '@/assets/experiences/bowl.glb';
import fish1 from '@/assets/experiences/fish1.png';
import fish2 from '@/assets/experiences/fish2.png';
import fish3 from '@/assets/experiences/fish3.png';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

const ARSceneNavigator = () => {
  const { id } = useLocalSearchParams();
  const dbService = useDatabaseService();
  const [experience, setExperience] = useState<Experience | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const experience = await dbService.getExperienceOfId(Number(id));
        setExperience(experience);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: `Expérience ${id?.toString()}`,
          headerBackTitle: 'Retour',
        }}
      />
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        style={styles.container}
      />
      {/* {experience?.steps?.map((step) => (
        <View key={step.id}>
          <Text>{step.image.data.attributes.url}</Text>
          <Text>{step.title}</Text>
          <Text>{step.text}</Text>
        </View>
      ))} */}
    </View>
  );
};

const AnimatedFish = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [fish1, fish2, fish3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((currentImage + 1) % images.length);
    }, 1000); // Change l'image toutes les 1000 ms (1 seconde)

    return () => {
      clearInterval(interval);
    };
  }, [currentImage, images.length]);

  return (
    <ViroImage
      source={images[currentImage]}
      position={[0, 0, -1]} // Position de l'image dans la scène
      scale={[1, 1, 1]} // Taille de l'image
    />
  );
};

export default ARSceneNavigator;

const HelloWorldSceneAR = () => {
  const [currentFishImage, setFishCurrentImage] = useState(0);
  const fishImages = [fish1, fish2, fish3];

  function onInitialized(
    state: ViroTrackingStateConstants,
    reason: ViroTrackingReason
  ) {
    console.log('🥽 onInitialized', state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log('🥽 Viro loaded');
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
      console.warn('🥽 ViroTrackingStateConstants.TRACKING_UNAVAILABLE');
    }
  }

  ViroARTrackingTargets.createTargets({
    statue: {
      source: require('@/assets/experiences/statue.jpg'),
      physicalWidth: 0.16,
      type: 'Image',
      orientation: 'Up',
    },
    opera: {
      source: require('@/assets/experiences/opera.jpg'),
      physicalWidth: 0.16,
      type: 'Image',
      orientation: 'Up',
    },
    halles: {
      source: require('@/assets/experiences/halles.jpg'),
      physicalWidth: 0.16,
      type: 'Image',
      orientation: 'Up',
    },
  });

  const anchorFound = () => {
    console.log('🥽 anchorFound');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFishCurrentImage((currentFishImage + 1) % fishImages.length);
    }, 500); // Change l'image toutes les 1000 ms (1 seconde)

    return () => {
      clearInterval(interval);
    };
  }, [currentFishImage, fishImages.length]);

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#ffffff" />

      <ViroARImageMarker target={'opera'} onAnchorFound={anchorFound}>
        <ViroNode position={[0, -0.2, 0]} rotation={[-90, 0, 0]}>
          <ViroBox position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} />
          <ViroText
            text={'Opéra de Lyon'}
            scale={[0.5, 0.5, 0.5]}
            position={[0, 0.5, 0.2]} // Ajusté pour être visible au-dessus du marker
            style={styles.flyingText}
          />
        </ViroNode>
      </ViroARImageMarker>

      <ViroARImageMarker target={'halles'} onAnchorFound={anchorFound}>
        <ViroNode position={[0, -0.5, 0]} rotation={[-90, 0, 0]}>
          <AnimatedFish />
          <Viro3DObject
            source={bowlObject}
            highAccuracyEvents={true}
            position={[0, -0.2, 0.5]}
            scale={[0.1, 0.1, 0.1]}
            rotation={[0, 0, 0]}
            type="GLB"
            onLoadStart={() => {
              console.log('Loading GLB model');
            }}
            onLoadEnd={() => {
              console.log('GLB model loaded successfully');
            }}
            onError={(error: any) => {
              console.log('Error loading GLB model:', error);
            }}
          />
          <ViroText
            text={'halles de lyon'}
            scale={[0.5, 0.5, 0.5]}
            position={[0.5, 0.5, 0]} // Ajusté pour être visible au-dessus du marker
            style={styles.flyingText}
          />
        </ViroNode>
      </ViroARImageMarker>
    </ViroARScene>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flyingText: {
    fontFamily: 'ITCAvantGardeMd',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
