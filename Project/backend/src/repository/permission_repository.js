import Permission from "../models/permissions.js";

export class PermissionRepository {
  #Permission;

  constructor() {
    this.#Permission = Permission;
  }

  async getPermissionById(id) {
    try {
      const permission = await this.#Permission.findById(id);
      if (!permission) {
        throw new Error(`Permission with id ${id} not found`);
      }
      return permission;
    } catch (error) {
      throw new Error(`Error fetching permission: ${error.message}`);
    }
  }

  async deletePermission(id) {
    try {
      const permission = await this.#Permission.findByIdAndDelete(id);
      if (!permission) {
        throw new Error(`Permission with id ${id} not found`);
      }
      return permission;
    } catch (error) {
      throw new Error(`Error removing permission: ${error.message}`);
    }
  }

  async createPermission(name) {
    try {
      const permission = await this.#Permission.create({ name });
      return permission;
    } catch (error) {
      throw new Error(`Error creating permission: ${error.message}`);
    }
  }

  async getAllPermissions() {
    try {
      const permissions = await this.#Permission.find();
      return permissions;
    } catch (error) {
      throw new Error(`Error fetching permissions: ${error.message}`);
    }
  }

  async updatePermission(id, updates) {
    try {
      const permission = await this.#Permission.findByIdAndUpdate(id, updates, {
        new: true,
      });
      if (!permission) {
        throw new Error(`Permission with id ${id} not found`);
      }
      return permission;
    } catch (error) {
      throw new Error(`Error updating permission: ${error.message}`);
    }
  }
}
