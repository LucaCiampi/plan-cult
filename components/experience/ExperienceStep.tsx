// ExperienceStep.tsx
import React from 'react';
import { ViroImage, ViroNode } from '@viro-community/react-viro';

interface ExperienceStepProps {
  experienceStep: ExperienceStep;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({
  experienceStep,
  position,
  rotation,
}) => {
  console.log('experienceStep', experienceStep);

  return (
    <ViroNode position={position} rotation={rotation}>
      {experienceStep.images !== undefined && (
        <ViroImage
          source={{ uri: experienceStep.images[0] }}
          position={[0, 0, -1]} // Position de l'image dans la scène
          scale={[1, 1, 1]} // Taille de l'image
        />
      )}
    </ViroNode>
  );
};

export default ExperienceStep;
