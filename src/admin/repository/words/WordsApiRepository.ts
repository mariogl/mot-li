import axios from "axios";
import { type WordDataStructure, type WordStructure } from "../../types";
import { type WordsRepository } from "./types";

class WordsApiRepository implements WordsRepository {
  constructor(
    private readonly apiUrl: string,
    private readonly token: string
  ) {}

  async getWordsByLength(length: number): Promise<WordStructure[]> {
    const {
      data: { words },
    } = await axios.get<{ words: WordStructure[] }>(
      `${this.apiUrl}/words?length=${length}`,
      {
        headers: { authorization: `Bearer ${this.token}` },
      }
    );

    return words;
  }

  async addWord(newWordData: WordDataStructure): Promise<WordStructure> {
    const {
      data: { word },
    } = await axios.post<{ word: WordStructure }>(
      `${this.apiUrl}/words`,
      newWordData,
      {
        headers: { authorization: `Bearer ${this.token}` },
      }
    );

    return word;
  }
}

export default WordsApiRepository;
