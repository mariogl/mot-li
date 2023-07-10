export const normalizeWord = (word: string): string => {
  const accents: Record<string, string> = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    à: "a",
    è: "e",
    ì: "i",
    ò: "o",
    ù: "u",
    ä: "a",
    ë: "e",
    ï: "i",
    ö: "o",
    ü: "u",
    â: "a",
    ê: "e",
    î: "i",
    ô: "o",
    û: "u",
    ç: "ç",
  };

  return word
    .replace(/[·.,:;()_?¿!¡-\s]/g, "")
    .replace(/[áéíóúàèìòùäëïöüâêîôûñ]/g, (match) => accents[match]);
};
