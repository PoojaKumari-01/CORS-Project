import User from "../models/users.js";

export class AuthRepository {
  #User;

  constructor() {
    this.#User = User;
  }

  async signupUser(id, password) {
    try {
      const user = await this.#User.create({
        login_id: id,
        password,
        type: "admin",
      });
      return user;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async loginUser(id, password) {
    try {
      const user = await this.#User.findOne({ login_id: id }).populate({
        path: "roles",
        populate: { path: "permissions" },
      });
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      if (!user.comparePassword(password)) {
        throw new Error("Invalid password");
      }
      const obj = user.toObject();
      delete obj.password;
      obj.permissions = obj.roles.flatMap((role) => role.permissions);
      return obj;
    } catch (error) {
      throw new Error(`Error logging in user: ${error.message}`);
    }
  }
}
