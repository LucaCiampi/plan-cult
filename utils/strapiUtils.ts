import Config from '@/constants/Config';

const token = process.env.EXPO_PUBLIC_STRAPI_TOKEN;
/**
 * When SQLite is unavailable, fetches data from the Strapi CMS server
 * @param endpoint the endpoint of the strapi REST API
 * @returns unkown data
 */
export const fetchDataFromStrapi = async (endpoint: string) => {
  try {
    const response = await fetch(Config.STRAPI_API_URL + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    console.log('🛜 fetchDataFromStrapi', data);
    return data;
  } catch (error) {
    console.error('Error fetching data from Strapi', error);
    throw error;
  }
};

export const normalizeCharacterFromStrapi = (data: any): Character[] => {
  return data.data.map((item: any) => ({
    id: item.id,
    name: item.attributes.name,
    surname: item.attributes.surname,
    birth: item.attributes.birth,
    death: item.attributes.death,
    avatar_url:
      Config.STRAPI_DOMAIN_URL + item.attributes.avatar.data.attributes.url,
  }));
};

export const normalizeDialogueFromStrapi = (data: any): Dialogue[] => {
  return data.data.map((item: any) => ({
    id: item.id,
    answers: item.attributes.answers,
    character: item.attributes.character,
    follow_up: item.attributes.follow_up,
    question_short: item.attributes.question_short,
    questions: item.attributes.questions,
  }));
};

export const normalizeCurrentConversationStateFromStrapi = (
  data: any
): CurrentConversationState[] => {
  return data.data.map((item: any) => ({
    character_id: item.attributes.character.data.id,
    dialogue_id: item.attributes.dialogues.data.map(
      (dialogue: any) => dialogue.id
    ),
    following_dialogues_id: item.attributes.dialogues.data.map(
      (dialogue: any) => dialogue.id
    ),
  }));
};
