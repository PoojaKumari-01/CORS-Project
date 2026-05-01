import { useState } from "react";
import { useAuth } from "../../contexts/useAuth.jsx";
import { LogOut, Menu, X, User, Key } from "lucide-react";

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white p-2 rounded-lg shadow-md text-slate-600 hover:text-slate-800 transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-slate-800">
                  User Portal
                </h1>
                <p className="text-sm text-slate-600">
                  Welcome, {user?.login_id}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Your Permissions
              </h3>
              <div className="space-y-1">
                {user?.permissions.map((permission) => {
                  return (
                    <button
                      key={permission.id}
                      onClick={() => setSidebarOpen(false)}
                      className="w-full flex items-center px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Key className="w-4 h-4 mr-2 text-slate-500" />
                      {permission.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {user?.permissions.length === 0 && (
              <div className="text-center py-8">
                <Key className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                  No permissions assigned
                </p>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <div className="p-6 lg:p-8">{children}</div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default UserLayout;
