import { type KeyStructure, type KeyType } from "../types";
import type DomAccessor from "./DomAccessor";

class KeyboardBuilder {
  private readonly keyLetters = "qwertyuiopasdfghjklçCzxcvbnmD";

  constructor(private readonly domAccessor: DomAccessor) {}

  public build() {
    const keys: KeyStructure[] = this.keyLetters.split("").map((letterKey) => {
      if (letterKey === "C") {
        return this.createKey("env", "action");
      }

      if (letterKey === "D") {
        return this.createKey("esb", "action");
      }

      return this.createKey(letterKey);
    });

    keys.forEach((key) => {
      const keyButton = document.createElement("button");

      keyButton.className = `key key--${key.status}`;
      if (key.type === "action") {
        keyButton.classList.add("key--action");
      }

      keyButton.dataset.type = key.type;
      keyButton.textContent = key.symbol;

      this.domAccessor.getKeyboardElement().appendChild(keyButton);
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
