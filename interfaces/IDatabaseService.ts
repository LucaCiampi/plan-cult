// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IDatabaseService {
  getAllCharacters: () => Promise<Character[]>;
  getAllLikedCharacters: () => Promise<Character[]>;
  getCharacterProfile: (characterId: number) => Promise<Character>;
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
  getCurrentConversationStateWithCharacter: (
    characterId: number
  ) => Promise<Dialogue[]>;
  getFirstDialoguesOfTrustLevel: (
    characterId: number,
    trustLevel: number
  ) => Promise<Dialogue[]>;
  getAllDialogueAnchors: () => Promise<DialogueAnchor[]>;
  getDialoguesOfId: (dialoguesId: number[]) => Promise<Dialogue[]>;
  getAllLandmarks: () => Promise<Landmark[]>;
}
