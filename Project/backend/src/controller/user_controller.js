import { UserService } from "../service/user_service.js";

export class UserController {
  #userService;

  constructor() {
    this.#userService = new UserService();
  }

  async createUser(req, res) {
    const { login_id, password, type, roles } = req.body;
    try {
      const user = await this.#userService.createUser(
        login_id,
        password,
        type,
        roles
      );
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.#userService.getAllUsers();
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await this.#userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      await this.#userService.deleteUser(id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addRoleToUser(req, res) {
    const { userId, roleId } = req.body;
    try {
      const user = await this.#userService.addRoleToUser(userId, roleId);
      res
        .status(200)
        .json({ message: "Role added to user successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeRoleFromUser(req, res) {
    const { userId, roleId } = req.body;
    try {
      const user = await this.#userService.removeRoleFromUser(userId, roleId);
      res
        .status(200)
        .json({ message: "Role removed from user successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUserRoles(req, res) {
    const { id } = req.params;
    const { roleIds } = req.body;
    try {
      const user = await this.#userService.updateUserRoles(id, roleIds);
      res.status(200).json({
        success: true,
        message: "User roles updated successfully",
        user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCurrentUserPermissions(req, res) {
    try {
      const userId = req.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      // Always populate roles and permissions
      const user = await this.#userService.getUserPermissionsById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      // Aggregate permissions from all roles
      const permissionsMap = new Map();
      for (const role of user.roles || []) {
        for (const perm of role.permissions || []) {
          const id = String(perm._id || perm.id);
          if (id && !permissionsMap.has(id)) {
            permissionsMap.set(id, { _id: perm._id, name: perm.name });
          }
        }
      }
      const permissions = Array.from(permissionsMap.values());
      res.status(200).json({ success: true, permissions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
