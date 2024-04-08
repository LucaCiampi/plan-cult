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
export const strapiDataCleansing = (data: any) => {
  const transformedData = data.data.map((item: any) => ({
    id: item.id,
    ...item.attributes,
  }));

  return transformedData;
};
