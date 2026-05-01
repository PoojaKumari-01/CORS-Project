import { createContext, useState, useEffect } from "react";
import { roleAPI, permissionAPI, userAPI } from "../services/api.js";
import { useAuth } from "./useAuth.jsx";

const DataContext = createContext(undefined);

export { DataContext };

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load initial data only if authenticated and user is available
  useEffect(() => {
    if (isAuthenticated && user) {
      // Add a small delay to ensure authentication is fully established
      const timer = setTimeout(() => {
        loadData();
        loadUsers();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permissionsRes] = await Promise.all([
        roleAPI.getAllRoles(),
        permissionAPI.getAllPermissions(),
      ]);

      setRoles(rolesRes.data.roles || []);
      setPermissions(permissionsRes.data.permissions || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData) => {
    try {
      const response = await userAPI.createUser(userData);
      if (response.data.success) {
        await loadUsers(); // reload users from backend
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error adding user:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add user",
      };
    }
  };

  // Only use updateUser for non-sensitive fields. Never update password or roles here.
  const updateUser = async (id, userData) => {
    if (userData.password !== undefined || userData.roles !== undefined) {
      console.warn(
        "updateUser: Attempted to update password or roles. This is not allowed. Use updateUserRoles for roles."
      );
      // Remove these fields if present
      const safeData = { ...userData };
      delete safeData.password;
      delete safeData.roles;
      userData = safeData;
    }
    try {
      // This only updates the local state, not the backend
      setUsers((prev) =>
        prev.map((user) => {
          if (user._id === id || user.id === id) {
            return { ...user, ...userData };
          }
          return user;
        })
      );
      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update user",
      };
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await userAPI.deleteUser(id);
      if (response.data.success) {
        setUsers((prev) =>
          prev.filter((user) => user._id !== id && user.id !== id)
        );
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete user",
      };
    }
  };

  const addRole = async (roleData) => {
    try {
      const response = await roleAPI.createRole(roleData);
      if (response.data.success) {
        setRoles((prev) => [...prev, response.data.role]);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error adding role:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add role",
      };
    }
  };

  const updateRole = async (id, roleData) => {
    try {
      setRoles((prev) =>
        prev.map((role) =>
          role._id === id || role.id === id ? { ...role, ...roleData } : role
        )
      );
      return { success: true };
    } catch (error) {
      console.error("Error updating role:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update role",
      };
    }
  };

  const deleteRole = async (id) => {
    try {
      const response = await roleAPI.deleteRole(id);
      if (response.data.success) {
        setRoles((prev) =>
          prev.filter((role) => role._id !== id && role.id !== id)
        );
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error deleting role:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete role",
      };
    }
  };

  const addPermission = async (permissionData) => {
    try {
      const response = await permissionAPI.createPermission(permissionData);
      if (response.data.success) {
        setPermissions((prev) => [...prev, response.data.permission]);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error adding permission:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add permission",
      };
    }
  };

  const updatePermission = async (id, permissionData) => {
    try {
      const response = await permissionAPI.updatePermission(id, permissionData);
      if (response.data.success) {
        setPermissions((prev) =>
          prev.map((permission) =>
            permission._id === id || permission.id === id
              ? { ...permission, ...permissionData }
              : permission
          )
        );
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error updating permission:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update permission",
      };
    }
  };

  const deletePermission = async (id) => {
    try {
      const response = await permissionAPI.deletePermission(id);
      if (response.data.success) {
        setPermissions((prev) =>
          prev.filter(
            (permission) => permission._id !== id && permission.id !== id
          )
        );
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error deleting permission:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete permission",
      };
    }
  };

  const reloadRoles = async () => {
    try {
      setLoading(true);
      const rolesRes = await roleAPI.getAllRoles();
      setRoles(rolesRes.data.roles || []);
    } catch (error) {
      console.error("Error reloading roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRoles = async (id, roleIds) => {
    try {
      const response = await userAPI.updateUserRoles(id, roleIds);
      if (response.data.success) {
        await loadUsers();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error updating user roles:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update user roles",
      };
    }
  };

  return (
    <DataContext.Provider
      value={{
        users,
        roles,
        permissions,
        loading,
        addUser,
        updateUser,
        deleteUser,
        addRole,
        updateRole,
        deleteRole,
        addPermission,
        updatePermission,
        deletePermission,
        reloadRoles,
        updateUserRoles,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
