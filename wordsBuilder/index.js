import fs from "fs";
import path from "path";

for (let length = 4; length <= 9; length++) {
  const originFilename = `motli-${length}.txt`;

  const words = fs.readFileSync(
    path.join("wordsBuilder", originFilename),
    "utf-8"
  );

  console.log(`Llegint ${originFilename}`);

  const targetFilename = `words${length}.ts`;

  fs.writeFileSync(
    path.join("src", "allowedWords", targetFilename),
    `export default ${JSON.stringify(
      words
        .split("\n")
        .map((word) => word.toLowerCase())
        .filter((word) => word !== "")
    )};`
  );

  console.log(`Generat ${targetFilename}`);
}
