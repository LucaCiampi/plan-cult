interface CurrentConversationState {
  character_id: number;
  dialogue_id: number;
  following_dialogues_id: string;
  dialogues: any; // Strapi
  character: any; // Strapi
}
