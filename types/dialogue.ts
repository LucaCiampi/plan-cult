interface Dialogue {
  id: string;
  question_short: string;
  questions: Message[];
  answers: Message[];
  followUp?: Dialogue[] | undefined; // Structure SQLite
  follow_up?: {
    data: { id: number; attributes: Dialogue }[];
  }; // Structure strapi
  action?: unknown; // to implement
}
