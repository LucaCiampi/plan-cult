import Button from '@/components/common/Button';
import { router } from 'expo-router';
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
  const [isCharactersLoaded, setIsCharactersLoaded] = useState(false);
  const [isCoordinatesUpdated, setIsCoordinatesUpdated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isSyncComplete = useSyncComplete();

  useEffect(() => {
    if (isSyncComplete) {
      dispatch(fetchAllCharacters())
        .unwrap()
        .then(() => {
          setIsCharactersLoaded(true);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [isSyncComplete, dispatch]);

  useEffect(() => {
    if (isCharactersLoaded) {
      dispatch(updateCharacterCoordinates())
        .unwrap()
        .then(() => {
          setIsCoordinatesUpdated(true);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [isCharactersLoaded, dispatch]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!isSyncComplete ? (
        <>
          <ActivityIndicator size="large" />
          <Text>Loading database...</Text>
        </>
      ) : isCoordinatesUpdated ? (
        <Button
          onPress={() => {
            router.navigate('/swipe');
          }}
        >
          Je suis prêt
        </Button>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
}
