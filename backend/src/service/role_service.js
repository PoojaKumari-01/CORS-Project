import { RoleRepository } from "../repository/role_repo.js";

export class RoleService {
  #roleRepository;

  constructor() {
    this.#roleRepository = new RoleRepository();
  }

  async createRole(name, permissions = []) {
    try {
      return await this.#roleRepository.createRole(name, permissions);
    } catch (error) {
      throw new Error(`Error creating role: ${error.message}`);
    }
  }

  async getAllRoles() {
    try {
      return await this.#roleRepository.getAllRoles();
    } catch (error) {
      throw new Error(`Error fetching roles: ${error.message}`);
    }
  }

  async getRoleById(id) {
    try {
      return await this.#roleRepository.getRoleById(id);
    } catch (error) {
      throw new Error(`Error fetching role: ${error.message}`);
    }
  }

  async deleteRole(id) {
    try {
      return await this.#roleRepository.deleteRole(id);
    } catch (error) {
      throw new Error(`Error removing role: ${error.message}`);
    }
  }

  async addPermissionToRole(roleId, permissionId) {
    try {
      return await this.#roleRepository.addPermissionToRole(
        roleId,
        permissionId
      );
    } catch (error) {
      throw new Error(`Error adding permission to role: ${error.message}`);
    }
  }

  async removePermissionFromRole(roleId, permissionId) {
    try {
      return await this.#roleRepository.removePermissionFromRole(
        roleId,
        permissionId
      );
    } catch (error) {
      throw new Error(`Error removing permission from role: ${error.message}`);
    }
  }

  async addPermissionsToRoleBulk(roleId, permissionIds) {
    try {
      return await this.#roleRepository.addPermissionsToRoleBulk(
        roleId,
        permissionIds
      );
    } catch (error) {
      throw new Error(`Error adding permissions to role: ${error.message}`);
    }
  }

  async removePermissionsFromRoleBulk(roleId, permissionIds) {
    try {
      return await this.#roleRepository.removePermissionsFromRoleBulk(
        roleId,
        permissionIds
      );
    } catch (error) {
      throw new Error(`Error removing permissions from role: ${error.message}`);
    }
  }
}
