type PinCategory = 'anecdote' | 'date' | 'character';

interface Landmark {
  id: number;
  name: string;
  description?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  thumbnail?: string;
  category: PinCategory;
}
