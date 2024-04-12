interface Character {
  id: number;
  name: string;
  surname: string;
  birth: string;
  death: string;
  avatar_url?: string;
  profile?: CharacterProfileSection[];
  trust_level?: number;
}
