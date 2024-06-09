import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroAmbientLight,
} from '@viro-community/react-viro';
import ArrowForwardIcon from '@/assets/images/arrow-forward.svg';
import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import ExperienceStep from '@/components/experience/ExperienceStep';
import Colors from '@/constants/Colors';
import Sizes from '@/constants/Sizes';
import useExperience from '@/hooks/useExperience';

const ARSceneNavigator = () => {
  const { id } = useLocalSearchParams();
  const { experience, currentStep, setCurrentStep, numberOfSteps, loading } =
    useExperience(Number(id));
  console.log('numberOfSteps', numberOfSteps);

  const handleNextStepButtonPress = useCallback(() => {
    console.log(currentStep + '/' + numberOfSteps);

    if (currentStep + 1 >= numberOfSteps) {
      router.navigate('/chat');
      return;
    }
    setCurrentStep(currentStep + 1);
  }, [currentStep, numberOfSteps]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.orange} />
        <Text>Chargement de l&apos;expérience...</Text>
      </View>
    );
  }

  if (experience === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Aucune expérience trouvée</Text>;
      </View>
    );
  }

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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          scene: ExperienceSceneAR,
        }}
        viroAppProps={{ experience, currentStep }}
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

const ExperienceSceneAR = (props: any) => {
  const { experience, currentStep } = props.sceneNavigator.viroAppProps;

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" />
      {experience?.steps?.map((step: any, index: number) => (
        <ExperienceStep
          key={step.id}
          experienceStep={step}
          isCurrent={index === currentStep}
        />
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
