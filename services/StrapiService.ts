import {
  fetchDataFromStrapi,
  normalizeCharacterFromStrapi,
  normalizeCharacterProfileFromStrapi,
  normalizeCurrentConversationStateFromStrapi,
  normalizeDialogueAnchorFromStrapi,
  normalizeDialogueFromStrapi,
  normalizeExperienceFromStrapi,
  normalizeLandmarksFromStrapi,
} from '@/utils/strapiUtils';

class StrapiService implements IDatabaseService {
  async getAllCharacters(): Promise<Character[]> {
    let data = await fetchDataFromStrapi('characters?populate=*&');
    data = normalizeCharacterFromStrapi(data);
    return data;
  }

  async getAllLikedCharacters(): Promise<Character[]> {
    let data = await fetchDataFromStrapi('characters?populate=*&');
    data = normalizeCharacterFromStrapi(data);
    return data;
  }

  async getCharacterProfile(characterId: number): Promise<Character> {
    let data = await fetchDataFromStrapi(
      `characters/${characterId}?populate[Profil][populate]=*&populate[avatar]=*`
    );
    data = normalizeCharacterProfileFromStrapi(data);
    return data;
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

  async getAllDialogueAnchors(): Promise<DialogueAnchor[]> {
    let allCurrentDialogueStates = await fetchDataFromStrapi(
      'dialogue-anchors?populate[dialogues][populate]=*&populate=character'
    );
    allCurrentDialogueStates = normalizeDialogueAnchorFromStrapi(
      allCurrentDialogueStates
    );

    return allCurrentDialogueStates;
  }

  async getCurrentConversationStateWithCharacter(
    characterId: number
  ): Promise<Dialogue[]> {
    let currentDialogueWithCharacter = await fetchDataFromStrapi(
      `dialogue-anchors?populate[dialogues][populate]=*&populate=character&filters[character][id][$eq]=${characterId}`
    );
    currentDialogueWithCharacter = normalizeCurrentConversationStateFromStrapi(
      currentDialogueWithCharacter
    );

    return await this.getDialoguesOfId(
      currentDialogueWithCharacter[0].following_dialogues_id as number[]
    );
  }

  async getFirstDialoguesOfTrustLevel(
    characterId: number,
    trustLevel: number
  ): Promise<Dialogue[]> {
    let currentDialogueWithCharacter = await fetchDataFromStrapi(
      `dialogue-anchors?populate[dialogues][populate]=*&populate=character&filters[character][id][$eq]=${characterId}&filters[trust_level][$eq]=${trustLevel}`
    );
    currentDialogueWithCharacter = normalizeCurrentConversationStateFromStrapi(
      currentDialogueWithCharacter
    );

    return await this.getDialoguesOfId(
      currentDialogueWithCharacter.following_dialogues_id as number[]
    );
  }

  async getDialoguesOfId(dialoguesId: number[]): Promise<Dialogue[]> {
    const filters = dialoguesId
      .map((id, index) => `filters[id][$in][${index}]=${id}`)
      .join('&');
    const endpoint = `dialogues?populate[answers][populate]=action.landmark&populate[questions][populate]=action.landmark&populate=follow_up&${filters}`;
    let dialoguesOfId = await fetchDataFromStrapi(endpoint);
    dialoguesOfId = normalizeDialogueFromStrapi(dialoguesOfId);
    return dialoguesOfId;
  }

  async getAllLandmarks(): Promise<Landmark[]> {
    return normalizeLandmarksFromStrapi(
      await fetchDataFromStrapi('landmarks?populate=*')
    );
  }

  async getExperienceOfId(experienceId: number): Promise<Experience> {
    return normalizeExperienceFromStrapi(
      await fetchDataFromStrapi(
        `experience/${experienceId}?populate[step][populate]=*`
      )
    );
  }
}

export default StrapiService;
