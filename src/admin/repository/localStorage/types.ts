export interface AuthStorageRepository {
  getToken(): string | undefined;
  logIn(token: string): void;
  logOut(): void;
}
