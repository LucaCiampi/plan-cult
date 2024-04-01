// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IDatabaseService {
  getAllCharacters: () => Promise<Character[]>;
  getAllLikedCharacters: () => Promise<Character[]>;
  saveConversationToConversationHistory: (
    characterId: number,
    isSentByUser: boolean,
    message: string
  ) => Promise<any>;
  loadConversationFromConversationHistory: (
    characterId: number
  ) => Promise<any>;
  saveCurrentDialogueNodeProgress: (
    characterId: number,
    dialogueId: string
  ) => Promise<any>;
  getCurrentDialogueNodeProgress: (characterId: number) => Promise<Dialogue[]>;
  getDialoguesOfId: (dialoguesId: number[]) => Promise<Dialogue[]>;
}
