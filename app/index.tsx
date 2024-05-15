import Button from '@/components/common/Button';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import {
  fetchAllCharacters,
  updateCharacterCoordinates,
} from '@/slices/charactersSlice';
import { useSyncComplete } from '@/contexts/DatabaseServiceContext';

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch<AppDispatch>(); // Utiliser le type AppDispatch
  const isSyncComplete = useSyncComplete();

  useEffect(() => {
    if (isSyncComplete) {
      setIsLoaded(true);
      void dispatch(fetchAllCharacters());
      void dispatch(updateCharacterCoordinates());
    }
  }, [isSyncComplete]);

  // if (isLoaded) {
  //   return <Redirect href={'/(app)/swipe'} />;
  // }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!isSyncComplete ? (
        <>
          <ActivityIndicator size="large" />
          <Text>Loading database...</Text>
        </>
      ) : (
        <Button
          onPress={() => {
            router.navigate('/swipe');
          }}
        >
          Je suis prêt
        </Button>
      )}
    </View>
  );
}
