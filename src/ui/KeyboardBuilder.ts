import {
  type StorageStructure,
  type Config,
  type DomAccessorStructure,
  type KeyStructure,
  type KeyType,
} from "../types";

class KeyboardBuilder {
  constructor(
    private readonly domAccessor: DomAccessorStructure,
    private readonly config: Config,
    private readonly storage: StorageStructure
  ) {}

  public build() {
    const keys: KeyStructure[][] = [];

    this.config.keyLetters.forEach((keyList) => {
      keys.push(
        keyList.split("").map((letterKey) => {
          if (letterKey === "C") {
            return this.createKey("", "action");
          }

          if (letterKey === "D") {
            return this.createKey("", "action");
          }

          return this.createKey(letterKey);
        })
      );
    });

    keys.forEach((keyRow) => {
      const row = document.createElement("div");
      row.classList.add("keyboard__row");
      this.domAccessor.getKeyboardElement().appendChild(row);

      let nAction = 1;

      keyRow.forEach((key) => {
        const keyButton = document.createElement("button");

        const savedUsedKey = this.storage.game.usedKeys.find(
          (usedKey) => usedKey.symbol === key.symbol
        );

        keyButton.className = `keyboard__key keyboard__key--${
          savedUsedKey ? savedUsedKey.status : key.status
        }`;
        if (key.type === "action") {
          keyButton.classList.add("keyboard__key--double");

          const srOnly = document.createElement("span");
          srOnly.classList.add("sr-only");
          srOnly.textContent = nAction === 1 ? "Enviar" : "Esborrar";

          keyButton.appendChild(srOnly);

          nAction++;
        } else {
          keyButton.textContent = key.symbol;
        }

        keyButton.dataset.type = key.type;

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
