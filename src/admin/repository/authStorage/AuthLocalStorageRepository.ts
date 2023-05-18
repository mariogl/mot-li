import { type AuthStorageRepository } from "./types";

class AuthLocalStorageRepository implements AuthStorageRepository {
  private readonly isLoggedKey = "isLogged";
  private readonly tokenKey = "token";

  getToken(): string | undefined {
    const isLogged = localStorage.getItem(this.isLoggedKey);
    const token = localStorage.getItem(this.tokenKey);

    if (isLogged !== "1" || !token) {
      return;
    }

    return token;
  }

  logIn(token: string): void {
    localStorage.setItem(this.isLoggedKey, "1");
    localStorage.setItem(this.tokenKey, token);
  }

  logOut(): void {
    localStorage.removeItem(this.isLoggedKey);
    localStorage.removeItem(this.tokenKey);
  }
}

export default AuthLocalStorageRepository;
