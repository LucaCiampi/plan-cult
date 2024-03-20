interface Dialogue {
  id: string;
  question_short: string;
  question: string[];
  answer: string[];
  followUp?: Dialogue[] | unknown;
}
