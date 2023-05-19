import AuthLocalStorageRepository from "../repository/localStorage/AuthLocalStorageRepository";
import Auth from "./Auth";

const auth = new Auth();
const authLocalStorageRepository = new AuthLocalStorageRepository();

const token = authLocalStorageRepository.getToken();

if (!window.location.href.endsWith("admin-login.html")) {
  if (token) {
    auth.loginUser(token);
  }

  if (!auth.isUserLogged()) {
    window.location.href = "admin-login.html";
  }
}

export default auth;
