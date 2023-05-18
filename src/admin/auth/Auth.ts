import { type UserData } from "./types";

class Auth {
  private user: UserData = {
    isLogged: false,
    token: "",
  };

  constructor() {
    this.logoutUser();
  }

  public logoutUser(): void {
    this.user = {
      isLogged: false,
      token: "",
    };
  }

  loginUser(token: string): void {
    this.user.isLogged = true;
    this.user.token = token;
  }

  public isUserLogged(): boolean {
    return this.user.isLogged;
  }

  public getToken(): string {
    return this.user.token;
  }
}

export default Auth;
