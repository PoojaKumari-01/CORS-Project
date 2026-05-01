import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: `https://${import.meta.env.VITE_API_URL}/api` || 'http://localhost:9000/api',
  withCredentials: true, // Include cookies for JWT
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling - removed automatic redirect to prevent login issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear token, let components handle navigation
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post("/auth/signup", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
};

// User API
export const userAPI = {
  createUser: (userData) => api.post("/user", userData),
  getAllUsers: () => api.get("/user"),
  getUserById: (id) => api.get(`/user/${id}`),
  deleteUser: (id) => api.delete(`/user/${id}`),
  addRoleToUser: (data) => api.post("/user/add-role", data),
  removeRoleFromUser: (data) => api.post("/user/remove-role", data),
  updateUserRoles: (id, roleIds) => api.put(`/user/${id}/roles`, { roleIds }),
  getCurrentUserPermissions: () => api.get("/user/permissions"),
};

// Role API
export const roleAPI = {
  createRole: (roleData) => api.post("/role", roleData),
  getAllRoles: () => api.get("/role"),
  getRoleById: (id) => api.get(`/role/${id}`),
  deleteRole: (id) => api.delete(`/role/${id}`),
  addPermissionToRole: (data) => api.post("/role/add-permission", data),
  removePermissionFromRole: (data) => api.post("/role/remove-permission", data),
  addPermissionsToRoleBulk: (data) =>
    api.post("/role/add-permissions-bulk", data),
  removePermissionsFromRoleBulk: (data) =>
    api.post("/role/remove-permissions-bulk", data),
};

// Permission API
export const permissionAPI = {
  createPermission: (permissionData) => api.post("/permission", permissionData),
  getAllPermissions: () => api.get("/permission"),
  getPermissionById: (id) => api.get(`/permission/${id}`),
  updatePermission: (id, permissionData) =>
    api.put(`/permission/${id}`, permissionData),
  deletePermission: (id) => api.delete(`/permission/${id}`),
};

export default api;
