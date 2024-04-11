interface Message {
  id?: number;
  text: string;
  isUserSent: boolean;
  action: MessageAction[];
}

interface MessageAction {
  id: number;
  landmark: {
    data: Landmark;
  };
}
