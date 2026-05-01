import { useState } from "react";
import { useData } from "../../contexts/useData.jsx";
import { roleAPI } from "../../services/api.js";
import { Plus, Edit2, Trash2, Shield, ChevronDown } from "lucide-react";

const RolesTab = () => {
  const { roles, permissions, addRole, updateRole, deleteRole, reloadRoles } =
    useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ role_name: "", permissions: [] });
  const [expandedRoles, setExpandedRoles] = useState(new Set());

  const openModal = (role) => {
    if (role) {
      setEditingRole(role);
      setFormData({ role_name: role.name, permissions: role.permissions });
    } else {
      setEditingRole(null);
      setFormData({ role_name: "", permissions: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({ role_name: "", permissions: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        permissions: formData.permissions.map((p) => p._id || p.id),
      };
      if (editingRole) {
        const result = await updateRole(
          editingRole._id || editingRole.id,
          payload
        );
        if (!result.success) {
          alert(result.message || "Failed to update role");
          return;
        }
        // Bulk update permissions
        await roleAPI.addPermissionsToRoleBulk({
          roleId: editingRole._id || editingRole.id,
          permissionIds: payload.permissions,
        });
        await reloadRoles();
      } else {
        const result = await addRole(payload);
        if (!result.success) {
          alert(result.message || "Failed to add role");
          return;
        }
        await reloadRoles();
      }
      closeModal();
    } catch (error) {
      console.error("Error handling role:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const toggleRoleExpansion = (roleId) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleId)) {
      newExpanded.delete(roleId);
    } else {
      newExpanded.add(roleId);
    }
    setExpandedRoles(newExpanded);
  };

  const togglePermission = async (permission) => {
    const exists = formData.permissions.some(
      (p) => (p._id || p.id) === (permission._id || permission.id)
    );
    if (exists) {
      // Remove permission from backend if editing
      if (editingRole) {
        await roleAPI.removePermissionsFromRoleBulk({
          roleId: editingRole._id || editingRole.id,
          permissionIds: [permission._id || permission.id],
        });
        await reloadRoles();
      }
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter(
          (p) => (p._id || p.id) !== (permission._id || permission.id)
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: [...prev.permissions, permission],
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Roles</h2>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <div
            key={role._id || role.id}
            className="bg-slate-50 rounded-lg p-4 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{role.name}</h3>
                  <p className="text-sm text-slate-600">
                    {role.permissions.length} permissions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRoleExpansion(role._id || role.id)}
                  className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedRoles.has(role._id || role.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => openModal(role)}
                  className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this role?")) {
                      try {
                        const result = await deleteRole(role._id || role.id);
                        if (!result.success) {
                          alert(result.message || "Failed to delete role");
                        }
                      } catch (error) {
                        console.error("Error deleting role:", error);
                        alert("An error occurred. Please try again.");
                      }
                    }
                  }}
                  className="p-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedRoles.has(role._id || role.id) && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="font-medium text-slate-700 mb-2">
                  Permissions:
                </h4>
                <div className="grid gap-2">
                  {role.permissions.map((permission) => (
                    <div
                      key={permission._id || permission.id}
                      className="bg-white p-3 rounded-lg border border-slate-200"
                    >
                      <div className="font-medium text-slate-800">
                        {permission.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {editingRole ? "Edit Role" : "Add Role"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={formData.role_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      role_name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Permissions
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
                  {permissions.map((permission) => (
                    <label
                      key={permission._id || permission.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.some(
                          (p) =>
                            (p._id || p.id) ===
                            (permission._id || permission.id)
                        )}
                        onChange={() => togglePermission(permission)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">
                        {permission.name}
                      </span>
                    </label>
                  ))}
                  {permissions.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-2">
                      No permissions available
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
                  {editingRole ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesTab;
