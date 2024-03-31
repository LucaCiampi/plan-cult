import Config from '@/constants/Config';

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
    return await fetchDataFromStrapi('');
  }

  async saveCurrentDialogueNodeProgress(
    characterId: number,
    dialogueId: string
  ): Promise<any> {
    console.log('💽 saveCurrentDialogueNodeProgress');
  }

  async getCurrentDialogueNodeProgress(characterId: number): Promise<any> {
    return await fetchDataFromStrapi('dialogues/' + characterId);
  }
}

const token = process.env.EXPO_PUBLIC_STRAPI_TOKEN;
/**
 * When SQLite is unavailable, fetches data from the Strapi CMS server
 * @param endpoint the endpoint of the strapi REST API
 * @returns unkown data
 */
const fetchDataFromStrapi = async (endpoint: string) => {
  try {
    const response = await fetch(Config.STRAPI_URL + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    console.log('🛜 fetchDataFromStrapi', data);
    return strapiDataCleansing(data);
  } catch (error) {
    console.error('Error fetching data from Strapi', error);
    throw error;
  }
};

/**
 * Only keeps data needed and flattens the object to use it within the app
 * @param data reponse from API
 * @returns any kind of data really
 */
const strapiDataCleansing = (data: any) => {
  const transformedData = data.data.map((item: any) => ({
    id: item.id,
    ...item.attributes,
  }));

  return transformedData;
};

export default StrapiService;
