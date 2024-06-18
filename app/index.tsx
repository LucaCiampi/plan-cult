import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import {
  fetchAllCharacters,
  updateCharacterCoordinates,
} from '@/slices/charactersSlice';
import { useSyncComplete } from '@/contexts/DatabaseServiceContext';
import LogoAnim from '@/assets/images/logo-anim.gif';

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

  useEffect(() => {
    if (isCoordinatesUpdated) {
      setTimeout(() => {
        router.navigate('/onboarding/1');
      }, 1000);
    }
  }, [isCoordinatesUpdated]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image style={{ width: 400, height: 400 }} source={LogoAnim} />
    </View>
  );
}
