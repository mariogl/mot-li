import DomAccessor from "../ui/DomAccessor";
import KeyboardBuilder from "../ui/KeyboardBuilder";
import UserInterface from "../ui/UserInterface";

class Game {
  private readonly wordToGuess = "pota";
  private readonly maxGuesses = 3;

  private currentGuessNumber = 0;
  private currentGuessLetterPosition = 0;

  constructor() {
    const domAccessor = new DomAccessor();
    const userInterface = new UserInterface(domAccessor);

    const keyboardBuilder = new KeyboardBuilder(domAccessor);

    keyboardBuilder.build();

    userInterface.onLetterPressed = (letter: string) => {
      console.log(letter);
    };
  }

  public incrementCurrentGuessNumber() {
    if (this.currentGuessNumber < this.maxGuesses - 1) {
      this.currentGuessNumber++;
    }
  }

  public incrementCurrentGuessLetterPosition() {
    if (this.currentGuessLetterPosition > this.wordToGuess.length) {
      this.incrementCurrentGuessNumber();
      this.resetCurrentGuessLetterPosition();
      return;
    }

    this.currentGuessLetterPosition++;
  }

  public getCurrentGuessNumber(): number {
    return this.currentGuessNumber;
  }

  public getCurrentGuessLetterPosition(): number {
    return this.currentGuessLetterPosition;
  }

  private resetCurrentGuessLetterPosition() {
    this.currentGuessLetterPosition = 0;
  }
}

export default Game;
