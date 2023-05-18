import { type GameDataStructure, type GameStructure } from "../types";

export interface GamesRepository {
  getCurrentGame(): Promise<GameStructure>;
}
export interface GamesPrivateRepository extends GamesRepository {
  getGames(): Promise<GameStructure[]>;
  addGame(newGameDate: GameDataStructure): Promise<GameStructure>;
  updateGame(game: GameStructure): Promise<GameStructure>;
  deleteGame(gameId: string): Promise<string>;
}
