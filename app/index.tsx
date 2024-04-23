import Button from '@/components/common/Button';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return <Redirect href={'/(app)/swipe'} />;
  }

  return (
    <View>
      <Button
        onPress={() => {
          setIsLoaded(true);
        }}
      >
        Je suis prêt
      </Button>
    </View>
  );
}
