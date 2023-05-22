import auth from "../auth";
import AuthLocalStorageRepository from "../repository/localStorage/AuthLocalStorageRepository";
import UserApiRepository from "../repository/user/UserApiRepository";
import { adminUrls } from "../urls";

const currentUrl = new URL(window.location.href);

if (currentUrl.pathname === adminUrls.login) {
  const form = document.querySelector(".form--admin")!;
  const password: HTMLInputElement = form.querySelector("#password")!;
  const error = document.querySelector(".error")!;

  const userRepository = new UserApiRepository(import.meta.env.VITE_API_URL);

  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    if (!password.value) {
      return;
    }

    try {
      const token = await userRepository.loginUser({
        password: password.value,
      });

      auth.loginUser(token);

      const authRepository = new AuthLocalStorageRepository();
      authRepository.logIn(token);

      window.location.href = "admin-list.html";
    } catch {
      error.textContent = "Credencials invàlides";
    }
  });
}
