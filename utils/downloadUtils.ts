import * as FileSystem from 'expo-file-system';

export async function downloadImage(imageUrl: string): Promise<string> {
  try {
    // Extraction du nom de fichier depuis l'URL
    const filename = imageUrl.split('/').pop();
    // Définition du chemin local où l'image sera sauvegardée
    // TODO: voir si le chemin de sauvegarde est adapté
    const localUri = `${FileSystem.documentDirectory}${filename}`;

    // Téléchargement de l'image vers le chemin local
    const { uri } = await FileSystem.downloadAsync(imageUrl, localUri);
    return uri;
  } catch (error) {
    console.error(
      "Erreur lors du téléchargement de l'image ayant pour URL : ",
      imageUrl,
      error
    );
    throw error;
  }
}
