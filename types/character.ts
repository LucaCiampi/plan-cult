interface Character {
  id: number;
  name: string;
  surname: string;
  birth: string;
  death: string;
  avatar?: any; // Strapi
  avatar_url?: string; // SQLite
}
