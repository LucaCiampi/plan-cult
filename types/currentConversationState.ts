interface CurrentConversationState {
  character_id: number;
  dialogue_id: string;
  following_dialogues_id: string;
  dialogues: any; // Strapi
  character: any; // Strapi
}
