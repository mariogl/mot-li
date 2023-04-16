import {
  type Config,
  type DomAccessorStructure,
  type KeyStructure,
  type KeyType,
} from "../types";

class KeyboardBuilder {
  constructor(
    private readonly domAccessor: DomAccessorStructure,
    private readonly config: Config
  ) {}

  public build() {
    const keys: KeyStructure[][] = [];

    this.config.keyLetters.forEach((keyList) => {
      keys.push(
        keyList.split("").map((letterKey) => {
          if (letterKey === "C") {
            return this.createKey("env", "action");
          }

          if (letterKey === "D") {
            return this.createKey("esb", "action");
          }

          return this.createKey(letterKey);
        })
      );
    });

    keys.forEach((keyRow) => {
      const row = document.createElement("div");
      row.classList.add("keyboard__row");
      this.domAccessor.getKeyboardElement().appendChild(row);

      keyRow.forEach((key) => {
        const keyButton = document.createElement("button");

        keyButton.className = `keyboard__key keyboard__key--${key.status}`;
        if (key.type === "action") {
          keyButton.classList.add("keyboard__key--double");
        }

        keyButton.dataset.type = key.type;
        keyButton.textContent = key.symbol;

        row.appendChild(keyButton);
      });
    });
  }

  private createKey(symbol: string, type: KeyType = "letter"): KeyStructure {
    return {
      status: "unused",
      type,
      symbol,
    };
  }
}

export default KeyboardBuilder;
