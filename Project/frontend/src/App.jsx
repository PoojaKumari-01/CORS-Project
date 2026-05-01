import { useState } from "react";
import { useAuth } from "./contexts/useAuth.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Login from "./components/Login";
import AdminLayout from "./components/admin/AdminLayout";
import UserLayout from "./components/user/UserLayout";
import Dashboard from "./components/admin/Dashboard";
import ManageUsers from "./components/admin/ManageUsers";
import UserDashboard from "./components/user/UserDashboard";

const AdminApp = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <AdminLayout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "users" && <ManageUsers />}
    </AdminLayout>
  );
};

const UserApp = () => {
  return (
    <UserLayout>
      <UserDashboard />
    </UserLayout>
  );
};

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }
  return user?.type === "admin" ? <AdminApp /> : <UserApp />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
