interface Dialogue {
  id: string;
  question_short: string;
  question: Message[];
  answer: Message[];
  followUp?: Dialogue[] | undefined;
}
