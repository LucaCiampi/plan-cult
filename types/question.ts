type Question = {
  id: string;
  question_short: string;
  question: string[];
  answer: string[];
  followUp?: Question[];
};
