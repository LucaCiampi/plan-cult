type PinCategory = 'default' | 'user' | 'anecdote' | 'date' | 'character';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Landmark {
  id: number;
  name: string;
  description?: string;
  coordinates: Coordinates;
  thumbnail?: string;
  category: PinCategory;
}
