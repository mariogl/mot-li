export interface GameDataStructure {
  word: string;
  date: Date;
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
