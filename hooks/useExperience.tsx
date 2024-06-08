import { useEffect, useState } from 'react';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

const useExperience = (id: number) => {
  const dbService = useDatabaseService();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  console.log('currentStep', currentStep);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const experience = await dbService.getExperienceOfId(Number(id));
        setExperience(experience);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchExperience();
  }, [id, dbService]);

  return { experience, currentStep, setCurrentStep };
};

export default useExperience;
