export interface WordDataStructure {
  word: string;
}

export interface WordStructure extends WordDataStructure {
  id: string;
  length: number;
}

export interface GameDataStructure {
  actualWord: string;
  word: string;
  date: string;
  guesses: number;
  link: string;
  linkText: string;
  definition: string;
}

export interface GameStructure extends GameDataStructure {
  id: string;
  length: number;
}

export interface UserCredentials {
  password: string;
}

export interface CustomError extends Error {
  statusCode: number;
}
