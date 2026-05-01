import { UserRepository } from "../repository/user_repository.js";

export class UserService {
  #userRepository;

  constructor() {
    this.#userRepository = new UserRepository();
  }

  async createUser(id, password, type = "user", roles = []) {
    try {
      return await this.#userRepository.createUser(id, password, type, roles);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      return await this.#userRepository.getAllUsers();
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      return await this.#userRepository.getUserById(id);
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      return await this.#userRepository.deleteUser(id);
    } catch (error) {
      throw new Error(`Error removing user: ${error.message}`);
    }
  }

  async addRoleToUser(userId, roleId) {
    try {
      return await this.#userRepository.addRoleToUser(userId, roleId);
    } catch (error) {
      throw new Error(`Error adding role to user: ${error.message}`);
    }
  }

  async removeRoleFromUser(userId, roleId) {
    try {
      return await this.#userRepository.removeRoleFromUser(userId, roleId);
    } catch (error) {
      throw new Error(`Error removing role from user: ${error.message}`);
    }
  }

  async updateUserRoles(userId, roleIds) {
    try {
      return await this.#userRepository.updateUserRoles(userId, roleIds);
    } catch (error) {
      throw new Error(`Error updating user roles: ${error.message}`);
    }
  }

  async getUserPermissionsById(userId) {
    try {
      return await this.#userRepository.getUserPermissionsById(userId);
    } catch (error) {
      throw new Error(`Error fetching user permissions: ${error.message}`);
    }
  }
}
