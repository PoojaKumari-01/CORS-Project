import { useState } from "react";
import { useData } from "../../contexts/useData.jsx";
import { Shield, Key } from "lucide-react";
import RolesTab from "./Roles.jsx";
import PermissionsTab from "./PermissionTab.jsx";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const { roles, permissions, loading } = useData();

  const tabs = [
    { key: "roles", label: "Roles", icon: Shield, count: roles.length },
    {
      key: "permissions",
      label: "Permissions",
      icon: Key,
      count: permissions.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600 mt-1">Manage roles and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer ${
              activeTab === tab.key ? "ring-2 ring-indigo-500" : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {tab.label}
                </p>
                <p className="text-2xl font-bold text-slate-800">{tab.count}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <tab.icon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <div className="flex items-center">
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-slate-600">Loading...</span>
            </div>
          ) : (
            <>
              {activeTab === "roles" && <RolesTab />}
              {activeTab === "permissions" && <PermissionsTab />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
