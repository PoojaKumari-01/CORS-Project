import { useState } from "react";
import { useData } from "../../contexts/useData.jsx";
import { Plus, Edit2, Trash2, User, Calendar } from "lucide-react";
import { userAPI, roleAPI } from "../../services/api.js";

const ManageUsers = () => {
  const { users, addUser, deleteUser, updateUserRoles } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    login_id: "",
    password: "",
    type: "user",
    roles: [],
  });
  const [modalRoles, setModalRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const openModal = async (user) => {
    setRolesLoading(true);
    try {
      // Always fetch latest roles from backend when opening modal
      const rolesRes = await roleAPI.getAllRoles();
      setModalRoles(rolesRes.data.roles || []);
    } catch {
      setModalRoles([]);
    } finally {
      setRolesLoading(false);
    }
    if (user) {
      // Fetch user by ID from backend for up-to-date roles/permissions
      const response = await userAPI.getUserById(user._id || user.id);
      const backendUser = response.data;
      setEditingUser(backendUser);
      setFormData({
        login_id: backendUser.login_id,
        password: "", // clear password for editing
        type: backendUser.type,
        roles: backendUser.roles || [],
      });
    } else {
      setEditingUser(null);
      setFormData({
        login_id: "",
        password: "",
        type: "user",
        roles: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      login_id: "",
      password: "",
      type: "user",
      roles: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const roleIds = formData.roles.map((r) => r._id || r.id);
        const result = await updateUserRoles(
          editingUser._id || editingUser.id,
          roleIds
        );
        if (!result.success) {
          alert(result.message || "Failed to update user");
          return;
        }
      } else {
        const result = await addUser(formData);
        if (!result.success) {
          alert(result.message || "Failed to add user");
          return;
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error handling user:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manage Users</h1>
          <p className="text-slate-600 mt-1">Create and manage user accounts</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user._id || user.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {user.login_id}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.type === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {user.createdAt
                        ? (typeof user.createdAt === "string" ||
                          typeof user.createdAt === "number"
                            ? new Date(user.createdAt)
                            : user.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(user)}
                  className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                  title="Edit user"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this user?")) {
                      try {
                        const result = await deleteUser(user._id || user.id);
                        if (!result.success) {
                          alert(result.message || "Failed to delete user");
                        }
                      } catch (error) {
                        console.error("Error deleting user:", error);
                        alert("An error occurred. Please try again.");
                      }
                    }
                  }}
                  className="p-2 text-red-600 hover:text-red-700 transition-colors"
                  title="Delete user"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {user.roles.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="font-medium text-slate-700 mb-2">Roles:</h4>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role._id || role.id}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {role.name}
                    </span>
                  ))}
                </div>
                {/* Show permissions for each role */}
                <div className="mt-2">
                  <h5 className="font-medium text-slate-600 mb-1 text-sm">
                    Permissions:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Map(
                        (
                          user.roles.flatMap(
                            (role) => role.permissions || []
                          ) || []
                        ).map((perm) => [
                          perm.perm_id || perm._id || perm.id,
                          perm,
                        ])
                      ).values()
                    ).map((perm) => (
                      <span
                        key={perm._id || perm.id}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                      >
                        {perm.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Login ID
                </label>
                <input
                  type="text"
                  value={formData.login_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      login_id: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={!!editingUser}
                />
              </div>

              {/* Password input only for adding a user */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  User Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!!editingUser}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Roles
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-3">
                  {rolesLoading ? (
                    <p className="text-sm text-slate-500 text-center py-2">
                      Loading roles...
                    </p>
                  ) : modalRoles.length > 0 ? (
                    modalRoles.map((role) => (
                      <label
                        key={role._id || role.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.roles.some(
                            (r) => (r._id || r.id) === (role._id || role.id)
                          )}
                          onChange={() => {
                            setFormData((prev) => {
                              const exists = prev.roles.some(
                                (r) => (r._id || r.id) === (role._id || role.id)
                              );
                              return {
                                ...prev,
                                roles: exists
                                  ? prev.roles.filter(
                                      (r) =>
                                        (r._id || r.id) !==
                                        (role._id || role.id)
                                    )
                                  : [...prev.roles, role],
                              };
                            });
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700">
                          {role.name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-2">
                      No roles available
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
