export function formatMapMarkerTitle(character: Character | undefined): string {
  if (character !== undefined) {
    return `Rencard avec ${character.name} ${character.surname ?? ''}`;
  }
  return 'Rencard à débloquer';
}
