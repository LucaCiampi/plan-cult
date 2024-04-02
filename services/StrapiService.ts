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
  ): Promise<any> {
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
    dialogueId: string
  ): Promise<any> {
    console.log('💽 saveCurrentDialogueNodeProgress');
  }

  async getCurrentDialogueNodeProgress(
    characterId: number
  ): Promise<Dialogue[]> {
    const currentDialogueWithCharacter = await fetchDataFromStrapi(
      `current-dialogue-states?populate=*&filters[character][id][$eq]=${characterId}`
    );

    const dialoguesId: any[] = [];
    currentDialogueWithCharacter[0].dialogues.data.forEach((element: any) => {
      dialoguesId.push(element.id);
    });

    const dialogues = this.getDialoguesOfId(dialoguesId as number[]);
    console.log(dialogues);

    return await this.getDialoguesOfId(dialoguesId as number[]);
  }

  async getDialoguesOfId(dialoguesId: number[]): Promise<Dialogue[]> {
    const filters = dialoguesId
      .map((id, index) => `filters[id][$in][${index}]=${id}`)
      .join('&');
    // TODO: do not populate "character"
    const endpoint = `dialogues?populate=*&${filters}`;
    return await fetchDataFromStrapi(endpoint);
  }
}

export default StrapiService;
