import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Page() {
  const dbService = useDatabaseService();

  useEffect(() => {
    void dbService.downloadCharactersData();
  }, []);

  return (
    <View>
      <Text>Index / onboarding</Text>
    </View>
  );
}
