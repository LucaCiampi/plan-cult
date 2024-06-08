import { minDistanceToSwipeCharacter } from '@/constants/Coordinates';

export const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const generateRandomPositionInBoundaries = (
  north: number,
  south: number,
  east: number,
  west: number
) => {
  const latitude = randomBetween(south, north);
  const longitude = randomBetween(west, east);
  return { latitude, longitude };
};

// Fonction pour calculer la distance entre deux points géographiques
export const haversineDistance = (
  coords1: Coordinates,
  coords2: Coordinates
) => {
  function toRad(x: any) {
    return (x * Math.PI) / 180;
  }

  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d * 1000; // Convertir en mètres
};

/**
 * Retourne true si la distance entre l'utilisateur et un point est inférieur ou égale à celle tolérée dans les constantes
 * @param userCoordinates Coordonnées LatLng de l'utilisateur
 * @param itemCoordonates Coordonnées LatLng de l'élément à comparer
 * @returns Booléen : true si la distance est <= à celle acceptée dans les constantes
 */
export const isNearUser = (
  userCoordinates: Coordinates,
  itemCoordonates: Coordinates
) => {
  return (
    haversineDistance(userCoordinates, itemCoordonates) <=
    minDistanceToSwipeCharacter
  );
};
