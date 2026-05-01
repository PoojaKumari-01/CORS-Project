import { PermissionRepository } from "../repository/permission_repository.js";

export class PermissionService {
  #permissionRepository;

  constructor() {
    this.#permissionRepository = new PermissionRepository();
  }

  async getPermissionById(id) {
    try {
      return await this.#permissionRepository.getPermissionById(id);
    } catch (error) {
      throw new Error(`Error fetching permission: ${error.message}`);
    }
  }

  async deletePermission(id) {
    try {
      return await this.#permissionRepository.deletePermission(id);
    } catch (error) {
      throw new Error(`Error removing permission: ${error.message}`);
    }
  }

  async createPermission(name) {
    try {
      return await this.#permissionRepository.createPermission(name);
    } catch (error) {
      throw new Error(`Error creating permission: ${error.message}`);
    }
  }

  async getAllPermissions() {
    try {
      return await this.#permissionRepository.getAllPermissions();
    } catch (error) {
      throw new Error(`Error fetching permissions: ${error.message}`);
    }
  }

  async updatePermission(id, updates) {
    try {
      return await this.#permissionRepository.updatePermission(id, updates);
    } catch (error) {
      throw new Error(`Error updating permission: ${error.message}`);
    }
  }
}
