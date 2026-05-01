import Role from "../models/roles.js";

export class RoleRepository {
  #Role;

  constructor() {
    this.#Role = Role;
  }

  async createRole(name, permissions = []) {
    try {
      const role = await this.#Role.create({ name, permissions });
      return await role.populate("permissions");
    } catch (error) {
      throw new Error(`Error creating role: ${error.message}`);
    }
  }

  async getAllRoles() {
    try {
      const roles = await this.#Role.find().populate("permissions");
      return roles;
    } catch (error) {
      throw new Error(`Error fetching roles: ${error.message}`);
    }
  }

  async getRoleById(id) {
    try {
      const role = await this.#Role.findById(id).populate("permissions");
      if (!role) {
        throw new Error(`Role with id ${id} not found`);
      }
      return role;
    } catch (error) {
      throw new Error(`Error fetching role: ${error.message}`);
    }
  }

  async deleteRole(id) {
    try {
      const role = await this.#Role.findByIdAndDelete(id);
      if (!role) {
        throw new Error(`Role with id ${id} not found`);
      }
      return role;
    } catch (error) {
      throw new Error(`Error removing role: ${error.message}`);
    }
  }

  async addPermissionToRole(roleId, permissionId) {
    try {
      const role = await this.#Role.findById(roleId);
      if (!role) {
        throw new Error(`Role with id ${roleId} not found`);
      }
      role.permissions.push(permissionId);
      await role.save();
      return role;
    } catch (error) {
      throw new Error(`Error adding permission to role: ${error.message}`);
    }
  }

  async removePermissionFromRole(roleId, permissionId) {
    try {
      const role = await this.#Role.findById(roleId);
      if (!role) {
        throw new Error(`Role with id ${roleId} not found`);
      }
      role.permissions = role.permissions.filter(
        (perm) => perm.toString() !== permissionId
      );
      await role.save();
      return role;
    } catch (error) {
      throw new Error(`Error removing permission from role: ${error.message}`);
    }
  }

  async addPermissionsToRoleBulk(roleId, permissionIds) {
    try {
      const role = await this.#Role.findById(roleId);
      if (!role) {
        throw new Error(`Role with id ${roleId} not found`);
      }
      // Avoid duplicates
      const current = role.permissions.map((p) => p.toString());
      const toAdd = permissionIds.filter((id) => !current.includes(id));
      role.permissions.push(...toAdd);
      await role.save();
      return await role.populate("permissions");
    } catch (error) {
      throw new Error(`Error adding permissions to role: ${error.message}`);
    }
  }

  async removePermissionsFromRoleBulk(roleId, permissionIds) {
    try {
      const role = await this.#Role.findById(roleId);
      if (!role) {
        throw new Error(`Role with id ${roleId} not found`);
      }
      role.permissions = role.permissions.filter(
        (perm) => !permissionIds.includes(perm.toString())
      );
      await role.save();
      return await role.populate("permissions");
    } catch (error) {
      throw new Error(`Error removing permissions from role: ${error.message}`);
    }
  }
}
