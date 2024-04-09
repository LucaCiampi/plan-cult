interface Landmark {
  id: number;
  title: string;
  description: string;
  coordinates: {
    latlng: {
      latitude: number;
      longitude: number;
    };
  };
}
