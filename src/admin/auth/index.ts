import AuthLocalStorageRepository from "../repository/localStorage/AuthLocalStorageRepository";
import { adminUrls } from "../urls";
import Auth from "./Auth";

const auth = new Auth();
const authLocalStorageRepository = new AuthLocalStorageRepository();

const token = authLocalStorageRepository.getToken();

const currentUrl = new URL(window.location.href);

if (currentUrl.pathname === adminUrls.login) {
  if (token) {
    window.location.href = adminUrls.list;
  }
} else {
  if (token) {
    auth.loginUser(token);
  }

  if (!auth.isUserLogged()) {
    window.location.href = adminUrls.login;
  }
}

document.querySelector(".button--logout")?.addEventListener("click", () => {
  auth.logoutUser();

  authLocalStorageRepository.logOut();

  window.location.href = adminUrls.login;
});

export default auth;
