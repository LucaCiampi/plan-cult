type PinCategory =
  | 'default'
  | 'user'
  | 'anecdote'
  | 'anecdoteSeen'
  | 'date'
  | 'character'
  | 'characterGlasses';

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
  characters: Character[];
}
