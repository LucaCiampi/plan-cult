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
