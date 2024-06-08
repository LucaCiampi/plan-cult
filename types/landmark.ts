interface Landmark {
  id: number;
  name: string;
  description?: string;
  coordinates: Coordinates;
  thumbnail?: string;
  category: PinCategory;
  characters: Character[];
  experience?: any;
}
