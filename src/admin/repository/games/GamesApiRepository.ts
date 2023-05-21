import axios from "axios";
import { type GamesPrivateRepository } from "./types";
import { type GameDataStructure, type GameStructure } from "../../types";

class GamesApiRepository implements GamesPrivateRepository {
  constructor(
    private readonly apiUrl: string,
    private readonly token: string
  ) {}

  async getGames(): Promise<GameStructure[]> {
    const {
      data: { games },
    } = await axios.get<{ games: GameStructure[] }>(`${this.apiUrl}/games`, {
      headers: { authorization: `Bearer ${this.token}` },
    });

    return games;
  }

  async getGameById(gameId: string): Promise<GameStructure> {
    const {
      data: { game },
    } = await axios.get<{ game: GameStructure }>(
      `${this.apiUrl}/games/${gameId}`,
      {
        headers: { authorization: `Bearer ${this.token}` },
      }
    );

    return game;
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
      newGameData,
      {
        headers: { authorization: `Bearer ${this.token}` },
      }
    );

    return game;
  }

  async deleteGame(gameId: string): Promise<string> {
    const {
      data: { id },
    } = await axios.delete<{ id: string }>(`${this.apiUrl}/games/${gameId}`, {
      headers: { authorization: `Bearer ${this.token}` },
    });

    return id;
  }

  async updateGame(game: GameStructure): Promise<GameStructure> {
    const gameToUpdate = {
      ...game,
      _id: game.id,
    };

    delete (gameToUpdate as any).id;

    const {
      data: { game: updatedGame },
    } = await axios.put<{ game: GameStructure }>(
      `${this.apiUrl}/games`,
      gameToUpdate,
      {
        headers: { authorization: `Bearer ${this.token}` },
      }
    );

    return updatedGame;
  }
}

export default GamesApiRepository;
