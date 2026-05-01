import { PermissionService } from "../service/permission_service.js";

export class PermissionController {
  #permissionService;

  constructor() {
    this.#permissionService = new PermissionService();
  }

  async getPermissionById(req, res) {
    try {
      const permission = await this.#permissionService.getPermissionById(
        req.params.id
      );
      res.status(200).json(permission);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deletePermission(req, res) {
    try {
      const permission = await this.#permissionService.deletePermission(
        req.params.id
      );
      res.status(200).json({
        success: true,
        message: "Permission deleted successfully",
        permission,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createPermission(req, res) {
    try {
      const permission = await this.#permissionService.createPermission(
        req.body.name
      );
      res.status(201).json({
        success: true,
        message: "Permission created successfully",
        permission,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllPermissions(req, res) {
    try {
      const permissions = await this.#permissionService.getAllPermissions();
      res.status(200).json({
        success: true,
        permissions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updatePermission(req, res) {
    try {
      const permission = await this.#permissionService.updatePermission(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Permission updated successfully",
        permission,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
