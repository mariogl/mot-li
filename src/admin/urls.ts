const baseUrl = import.meta.env.BASE_URL;

export const adminUrls = {
  login: `${baseUrl}admin-login.html`,
  gamesList: `${baseUrl}admin-games.html`,
  newGame: `${baseUrl}admin-new-game.html`,
  editGame: `${baseUrl}admin-edit-game.html`,
  wordsList: `${baseUrl}admin-words.html`,
  newWord: `${baseUrl}admin-new-word.html`,
};

export const isValidUrl = (url: string) => {
  const currentUrl = new URL(window.location.href);

  return (
    currentUrl.pathname === url ||
    currentUrl.pathname === url.replace(".html", "")
  );
};
