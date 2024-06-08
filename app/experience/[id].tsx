import {
  ViroARImageMarker,
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroBox,
  ViroImage,
  ViroNode,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from '@viro-community/react-viro';
import ArrowForwardIcon from '@/assets/images/arrow-forward.svg';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import ExperienceStep from '@/components/experience/ExperienceStep';
import Colors from '@/constants/Colors';
import Sizes from '@/constants/Sizes';

const ARSceneNavigator = () => {
  const { id } = useLocalSearchParams();
  const dbService = useDatabaseService();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

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

  const handleNextStepButtonPress = useCallback(() => {
    if (currentStep + 1 === experience?.steps.length) {
      router.navigate('/chat');
      return;
    }
    setCurrentStep(currentStep + 1);
  }, [currentStep]);

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
          scene: ExperienceSceneAR,
        }}
        viroAppProps={experience}
        style={styles.container}
      />
      <View style={styles.firstLevelUi}>
        <Text style={styles.firstLevelUiTitle}>
          {experience?.steps[currentStep].title ?? 'titre'}
        </Text>
        <Text>{experience?.steps[currentStep].text ?? 'texte'}</Text>
        <TouchableOpacity
          style={styles.firstLevelUIArrow}
          onPress={handleNextStepButtonPress}
        >
          <ArrowForwardIcon width={45} height={45} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ARSceneNavigator;

const ExperienceSceneAR = () => {
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
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" />
      {experience?.steps?.map((step) => (
        <ExperienceStep key={step.id} experienceStep={step} />
      ))}
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
  firstLevelUi: {
    position: 'absolute',
    color: Colors.grey,
    bottom: Sizes.padding * 4,
    left: Sizes.padding,
    right: Sizes.padding,
    padding: Sizes.padding,
    borderRadius: Sizes.borderRadius,
    backgroundColor: Colors.lightBeige,
    borderWidth: 2,
    borderColor: Colors.darkGrey,
    shadowColor: Colors.darkGrey,
    shadowOffset: {
      width: 4,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
  firstLevelUiTitle: {
    fontSize: Sizes.subtitleFontSize,
    color: Colors.orange,
    fontWeight: 'bold',
  },
  firstLevelUIArrow: {
    position: 'absolute',
    bottom: -Sizes.padding * 3,
    right: 0,
    elevation: 2,
    backgroundColor: Colors.white,
    borderRadius: 999,
    shadowColor: Colors.darkGrey,
    shadowOffset: {
      width: 4,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});
