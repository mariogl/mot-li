import auth from "../auth";
import AuthLocalStorageRepository from "../repository/localStorage/AuthLocalStorageRepository";
import UserApiRepository from "../repository/user/UserApiRepository";

if (window.location.href.endsWith("admin-login.html")) {
  const form = document.querySelector(".form--admin")!;
  const password: HTMLInputElement = document.querySelector(
    ".form--admin #password"
  )!;
  const error = document.querySelector(".error")!;

  const userRepository = new UserApiRepository(
    import.meta.env.VITE_API_URL as string
  );

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
