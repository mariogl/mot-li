import { type GameDataStructure, type GameStructure } from "../types";

export interface GamesRepository {
  getGames(): Promise<GameStructure[]>;
  getCurrentGame(): Promise<GameStructure>;
  addGame(newGameDate: GameDataStructure): Promise<GameStructure>;
}
