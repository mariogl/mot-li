import axios from "axios";
import { type UserCredentials } from "../../types";
import { type UserRepository } from "./types";

class UserApiRepository implements UserRepository {
  constructor(private readonly apiUrl: string) {}

  async loginUser(credentials: UserCredentials): Promise<string> {
    const {
      data: { token },
    } = await axios.post<{ token: string }>(
      `${this.apiUrl}/user/login`,
      credentials
    );

    return token;
  }
}

export default UserApiRepository;
