import bcrypt from "bcrypt";
import User from "../models/users.js";
import Role from "../models/roles.js";

export class UserRepository {
  #User;
  constructor() {
    this.#User = User;
  }

  async createUser(id, password, type = "user", roles = []) {
    try {
      const SALT = bcrypt.genSaltSync(9);
      const encryptedPassword = bcrypt.hashSync(password, SALT);
      roles = roles.map((role) => role._id);
      const user = await this.#User.create({
        login_id: id,
        password: encryptedPassword,
        type,
        roles,
      });
      const obj = user.toObject();
      delete obj.password;
      return obj;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      const users = await this.#User.find().populate({
        path: "roles",
        populate: { path: "permissions" },
      });
      // Remove password from all users
      return users.map((user) => {
        const obj = user.toObject();
        delete obj.password;
        return obj;
      });
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      const user = await this.#User.findById(id).populate({
        path: "roles",
        populate: {
          path: "permissions",
        },
      });
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      const obj = user.toObject();
      delete obj.password;
      return obj;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.#User.findByIdAndDelete(id);
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error removing user: ${error.message}`);
    }
  }

  async addRoleToUser(userId, roleId) {
    try {
      const user = await this.#User.findById(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      const role = await Role.findOne({ id: roleId });
      if (!role) {
        throw new Error(`Role with id ${roleId} not found`);
      }
      user.roles.push(role._id);
      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Error adding role to user: ${error.message}`);
    }
  }

  async removeRoleFromUser(userId, roleId) {
    try {
      const user = await this.#User.findById(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      user.roles = user.roles.filter((role) => role.toString() !== roleId);
      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Error removing role from user: ${error.message}`);
    }
  }

  async updateUserRoles(userId, roleIds) {
    try {
      const user = await this.#User.findById(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      user.roles = roleIds;
      await user.save();
      await user.populate({ path: "roles", populate: { path: "permissions" } });
      const obj = user.toObject();
      delete obj.password;
      return obj;
    } catch (error) {
      throw new Error(`Error updating user roles: ${error.message}`);
    }
  }

  async getUserPermissionsById(userId) {
    try {
      const user = await this.#User.findById(userId).populate({
        path: "roles",
        populate: { path: "permissions" },
      });
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      const obj = user.toObject();
      delete obj.password;
      return obj;
    } catch (error) {
      throw new Error(`Error fetching user permissions: ${error.message}`);
    }
  }
}
