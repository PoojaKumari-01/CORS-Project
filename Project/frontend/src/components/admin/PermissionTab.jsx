import React, { useState } from "react";
import { useData } from "../../contexts/useData.jsx";
import { Plus, Edit2, Trash2, Key } from "lucide-react";

const PermissionsTab = () => {
  const { permissions, addPermission, updatePermission, deletePermission } =
    useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  const openModal = (permission) => {
    if (permission) {
      setEditingPermission(permission);
      setFormData({
        name: permission.name,
      });
    } else {
      setEditingPermission(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPermission(null);
    setFormData({ name: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        const result = await updatePermission(
          editingPermission._id || editingPermission.id,
          formData
        );
        if (!result.success) {
          alert(result.message || "Failed to update permission");
          return;
        }
      } else {
        const result = await addPermission(formData);
        if (!result.success) {
          alert(result.message || "Failed to add permission");
          return;
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error handling permission:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Permissions</h2>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Permission
        </button>
      </div>

      <div className="grid gap-4">
        {permissions.map((permission) => (
          <div
            key={permission._id || permission.id}
            className="bg-slate-50 rounded-lg p-4 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {permission.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(permission)}
                  className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (
                      confirm(
                        "Are you sure you want to delete this permission?"
                      )
                    ) {
                      try {
                        const result = await deletePermission(
                          permission._id || permission.id
                        );
                        if (!result.success) {
                          alert(
                            result.message || "Failed to delete permission"
                          );
                        }
                      } catch (error) {
                        console.error("Error deleting permission:", error);
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
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {editingPermission ? "Edit Permission" : "Add Permission"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Permission Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
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
                  {editingPermission ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsTab;
