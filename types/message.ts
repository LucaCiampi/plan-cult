interface StrapiMessage {
  id: number;
  text: {
    children: {
      text: string;
      type: string;
    }[];
  }[];
}

interface Message {
  text: string;
  isUserSent: boolean;
}
