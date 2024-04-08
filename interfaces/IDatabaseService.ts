// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IDatabaseService {
  getAllCharacters: () => Promise<Character[]>;
  getAllLikedCharacters: () => Promise<Character[]>;
  saveConversationToConversationHistory: (
    characterId: number,
    isSentByUser: boolean,
    message: string
  ) => Promise<void>;
  loadConversationFromConversationHistory: (
    characterId: number
  ) => Promise<any>;
  saveCurrentDialogueNodeProgress: (
    characterId: number,
    dialogueId: string,
    followingDialoguesId: number[]
  ) => Promise<void>;
  getCurrentDialogueNodeProgress: (characterId: number) => Promise<Dialogue[]>;
  getDialoguesOfId: (dialoguesId: number[]) => Promise<Dialogue[]>;
  downloadCharactersData: () => Promise<void>;
}
