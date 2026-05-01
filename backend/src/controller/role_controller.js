import { RoleService } from "../service/role_service.js";

export class RoleController {
  #roleService;

  constructor() {
    this.#roleService = new RoleService();
  }

  async createRole(req, res) {
    const { role_name, permissions } = req.body;
    try {
      const role = await this.#roleService.createRole(role_name, permissions);
      res.status(201).json({
        success: true,
        message: "Role created successfully",
        role,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllRoles(req, res) {
    try {
      const roles = await this.#roleService.getAllRoles();
      res.status(200).json({
        success: true,
        roles,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getRoleById(req, res) {
    const { id } = req.params;
    try {
      const role = await this.#roleService.getRoleById(id);
      res.status(200).json(role);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteRole(req, res) {
    const { id } = req.params;
    try {
      await this.#roleService.deleteRole(id);
      res.status(200).json({
        success: true,
        message: "Role deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addPermissionToRole(req, res) {
    const { roleId, permissionId } = req.body;
    try {
      const role = await this.#roleService.addPermissionToRole(
        roleId,
        permissionId
      );
      res
        .status(200)
        .json({ message: "Permission added to role successfully", role });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removePermissionFromRole(req, res) {
    const { roleId, permissionId } = req.body;
    try {
      const role = await this.#roleService.removePermissionFromRole(
        roleId,
        permissionId
      );
      res
        .status(200)
        .json({ message: "Permission removed from role successfully", role });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addPermissionsToRoleBulk(req, res) {
    const { roleId, permissionIds } = req.body;
    try {
      const role = await this.#roleService.addPermissionsToRoleBulk(
        roleId,
        permissionIds
      );
      res.status(200).json({
        success: true,
        message: "Permissions added to role successfully",
        role,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async removePermissionsFromRoleBulk(req, res) {
    const { roleId, permissionIds } = req.body;
    try {
      const role = await this.#roleService.removePermissionsFromRoleBulk(
        roleId,
        permissionIds
      );
      res.status(200).json({
        success: true,
        message: "Permissions removed from role successfully",
        role,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
