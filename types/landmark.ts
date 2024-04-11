type LandmarkCategory = 'culture' | 'museum' | 'food';

interface Landmark {
  id: number;
  name: string;
  description?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  thumbnail?: string;
  category: LandmarkCategory;
}
