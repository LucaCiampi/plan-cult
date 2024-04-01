interface Dialogue {
  id: string;
  question_short: string;
  questions: StrapiMessage[];
  answers: StrapiMessage[];
  followUp?: Dialogue[] | undefined;
  action?: unknown; // to implement
}
