/**
 * Description: Constants with socket events
 */

export const SOCKET = {
  // Base events
  CONNECTION: 'connection',
  JOIN: 'join',
  DISCONNECT: 'disconnect',
  SYSTEM_MESSAGE: 'systemMessage',
  SEND_MESSAGE: 'sendMessage',
  // Gamer events
  SET_GAME: 'setGame',
  // Admin events
  GET_GAME: 'getGame',
  SET_GAME_ADMIN: 'setGameAdmin',
  START_GAME: 'startGame',
  ENTER_GAME: 'enterGame',
  END_GAME_REDIRECT: 'endGameRedirect',
  END_GAME: 'endGame',
} as const;
