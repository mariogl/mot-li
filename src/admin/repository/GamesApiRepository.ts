import axios from "axios";
import { type GamesRepository } from "./types";
import { type GameStructure } from "../types";

class GamesApiRepository implements GamesRepository {
  constructor(private readonly apiUrl: string) {}

  async getGames(): Promise<GameStructure[]> {
    const {
      data: { games },
    } = await axios.get<{ games: GameStructure[] }>(`${this.apiUrl}/games`);

    return games;
  }
}

export default GamesApiRepository;
