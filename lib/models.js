// DKP model helpers for MongoDB
export const collections = {
  USERS: 'users',
  GUILDS: 'guilds',
  CHARACTERS: 'characters',
  DKP: 'dkp',
  EVENTS: 'events',
  ITEMS: 'items',
  BIDS: 'bids',
  PINS: 'pins',
  CLASSES: 'classes',
};

export function getGuildIdFromUser(user) {
  // Placeholder: extract guild/server ID from user session or Discord API
  return user.guildId || null;
}
