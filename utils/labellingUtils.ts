export function formatMapMarkerTitle(character: Character | undefined): string {
  if (character !== undefined) {
    return `Rencard avec ${character.name} ${character.surname ?? ''}`;
  }
  return 'Rencard à débloquer';
}

export function truncateText(text: string, wordLimit: number): string {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '…';
  }
  return text;
}
