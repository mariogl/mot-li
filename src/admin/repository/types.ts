import { type GameStructure } from "../types";

export interface GamesRepository {
  getGames(): Promise<GameStructure[]>;
  getCurrentGame(): Promise<GameStructure>;
}
