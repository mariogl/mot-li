import { type WordStructure } from "../../types";

export interface WordsRepository {
  getWordsByLength(length: number): Promise<WordStructure[]>;
}
