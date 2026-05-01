import { AuthRepository } from "../repository/auth_repository.js";

export class AuthService {
  #authRepository;

  constructor() {
    this.#authRepository = new AuthRepository();
  }

  async signupUser(id, password) {
    try {
      return await this.#authRepository.signupUser(id, password);
    } catch (error) {
      throw new Error(`Error signing up user: ${error.message}`);
    }
  }

  async loginUser(id, password) {
    try {
      return await this.#authRepository.loginUser(id, password);
    } catch (error) {
      throw new Error(`Error logging in user: ${error.message}`);
    }
  }
}
