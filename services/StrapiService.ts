import { fetchDataFromStrapi } from '@/utils/strapiUtils';

class StrapiService implements IDatabaseService {
  async getAllCharacters(): Promise<Character[]> {
    return await fetchDataFromStrapi('characters');
  }

  async getAllLikedCharacters(): Promise<Character[]> {
    return await fetchDataFromStrapi('characters');
  }

  async saveConversationToConversationHistory(
    characterId: number,
    isSentByUser: boolean,
    message: string
  ): Promise<void> {
    // const currentDate = new Date();
    // const fromUser = isSentByUser ? 1 : 0;
    console.log('💽 saveConversationToConversationHistory');
  }

  async loadConversationFromConversationHistory(
    characterId: number
  ): Promise<any> {
    return [];
  }

  async saveCurrentDialogueNodeProgress(
    characterId: number,
    dialogueId: string,
    followingDialoguesId: number[]
  ): Promise<void> {
    console.log('💽 saveCurrentDialogueNodeProgress');
  }

  async getCurrentDialogueNodeProgress(
    characterId: number
  ): Promise<Dialogue[]> {
    const currentDialogueWithCharacter = await fetchDataFromStrapi(
      `current-dialogue-states?populate=*&filters[character][id][$eq]=${characterId}`
    );

    const dialoguesId: number[] = [];
    currentDialogueWithCharacter[0].dialogues.data.forEach(
      (element: { id: number }) => {
        dialoguesId.push(element.id);
      }
    );

    return await this.getDialoguesOfId(dialoguesId);
  }

  async getDialoguesOfId(dialoguesId: number[]): Promise<Dialogue[]> {
    const filters = dialoguesId
      .map((id, index) => `filters[id][$in][${index}]=${id}`)
      .join('&');
    // TODO: do not populate "character"
    const endpoint = `dialogues?populate=*&${filters}`;
    return await fetchDataFromStrapi(endpoint);
  }

  async syncCharactersData(): Promise<void> {
    console.log('💽 syncCharactersData');
  }
}

export default StrapiService;
