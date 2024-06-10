// ExperienceStep.tsx
import React from 'react';
import { ViroImage, ViroNode, ViroVideo } from '@viro-community/react-viro';

interface ExperienceStepProps {
  experienceStep: ExperienceStep;
  position?: [number, number, number];
  rotation?: [number, number, number];
  isCurrent: boolean;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({
  experienceStep,
  position,
  rotation,
  isCurrent,
}) => {
  const imagePosition = isCurrent ? -1 : -2;

  return (
    <ViroNode position={position} rotation={rotation}>
      {experienceStep.images?.[0] !== undefined &&
        (experienceStep.images[0].mimeType === 'video/mp4' ? (
          <ViroVideo
            source={{ uri: experienceStep.images[0].src }}
            loop={true}
            position={[0, 0, imagePosition]}
            scale={[1, 1, 1]}
          />
        ) : (
          <ViroImage
            source={{ uri: experienceStep.images[0].src }}
            position={[0, 0, imagePosition]} // Position de l'image dans la scène
            scale={[1, 1, 1]} // Taille de l'image
          />
        ))}
    </ViroNode>
  );
};

export default ExperienceStep;
