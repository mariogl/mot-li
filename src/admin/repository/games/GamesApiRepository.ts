import axios from "axios";
import { type GamesPrivateRepository } from "./types";
import { type GameDataStructure, type GameStructure } from "../../types";

class GamesApiRepository implements GamesPrivateRepository {
  constructor(private readonly apiUrl: string) {}

  async getGames(): Promise<GameStructure[]> {
    const {
      data: { games },
    } = await axios.get<{ games: GameStructure[] }>(`${this.apiUrl}/games`);

    return games;
  }

  async getCurrentGame(): Promise<GameStructure> {
    const {
      data: { game },
    } = await axios.get<{ game: GameStructure }>(
      `${this.apiUrl}/games/current`
    );

    return game;
  }

  async addGame(newGameData: GameDataStructure): Promise<GameStructure> {
    const {
      data: { game },
    } = await axios.post<{ game: GameStructure }>(
      `${this.apiUrl}/games`,
      newGameData
    );

    return game;
  }

  async deleteGame(gameId: string): Promise<string> {
    const {
      data: { id },
    } = await axios.delete<{ id: string }>(`${this.apiUrl}/games/${gameId}`);

    return id;
  }

  async updateGame(game: GameStructure): Promise<GameStructure> {
    const {
      data: { game: updatedGame },
    } = await axios.put<{ game: GameStructure }>(`${this.apiUrl}/games`, game);

    return updatedGame;
  }
}

export default GamesApiRepository;
