interface Dialogue {
  id: string;
  question_short: string;
  questions: StrapiMessage[];
  answers: StrapiMessage[];
  followUp?: Dialogue[] | undefined; // Structure SQLite
  follow_up?: {
    data: { id: number; attributes: Dialogue }[];
  }; // Structure strapi
  action?: unknown; // to implement
}
