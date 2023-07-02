import axios from "axios";
import {
  type GameDataStructure,
  type GameStructure,
  type WordStructure,
} from "../../types";
import { type GamesPrivateRepository } from "./types";

class GamesApiRepository implements GamesPrivateRepository {
  constructor(
    private readonly apiUrl: string,
    private readonly token: string
  ) {}

  async isWordScheduled(word: string): Promise<boolean> {
    const {
      data: { isScheduled },
    } = await axios.get<{ isScheduled: boolean }>(
      `${this.apiUrl}/games/is-word-scheduled?word=${word}`,
      {
        headers: { authorization: `Bearer ${this.token}` },
      }
    );

    return isScheduled;
  }

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

  async getAllowedWordsByLength(length: number): Promise<WordStructure[]> {
    const {
      data: { words },
    } = await axios.get<{ words: WordStructure[] }>(
      `${this.apiUrl}/words?length=${length}`
    );

    return words;
  }
}

export default GamesApiRepository;
