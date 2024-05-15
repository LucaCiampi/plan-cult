interface Character {
  id: number;
  name: string;
  surname: string;
  birth: string;
  death: string;
  avatar_url?: string;
  profile?: CharacterProfileSection[];
  trust_level?: number;
  detoured_character?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
