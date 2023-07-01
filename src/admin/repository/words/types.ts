import { type WordDataStructure, type WordStructure } from "../../types";

export interface WordsRepository {
  getWordsByLength(length: number): Promise<WordStructure[]>;
  addWord(newWordData: WordDataStructure): Promise<WordStructure>;
  deleteWord(wordId: string): Promise<string>;
}
