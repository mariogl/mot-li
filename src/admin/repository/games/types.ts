import {
  type GameDataStructure,
  type GameStructure,
  type WordStructure,
} from "../../types";

export interface GamesRepository {
  getCurrentGame(): Promise<GameStructure>;
  getAllowedWordsByLength(length: number): Promise<WordStructure[]>;
}
export interface GamesPrivateRepository extends GamesRepository {
  isWordScheduled(word: string): Promise<boolean>;
  getGames(): Promise<GameStructure[]>;
  getGameById(gameId: string): Promise<GameStructure>;
  addGame(newGameDate: GameDataStructure): Promise<GameStructure>;
  updateGame(game: GameStructure): Promise<GameStructure>;
  deleteGame(gameId: string): Promise<string>;
}
