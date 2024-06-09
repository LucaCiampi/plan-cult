import { useEffect, useState } from 'react';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

const useExperience = (id: number) => {
  const dbService = useDatabaseService();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const experience = await dbService.getExperienceOfId(Number(id));
        setExperience(experience);
      } catch (error) {
        console.error('Error fetching experience:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, dbService]);

  const numberOfSteps = experience?.steps?.length ?? 0;

  return { experience, currentStep, setCurrentStep, loading, numberOfSteps };
};

export default useExperience;
