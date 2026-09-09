import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { RequestsProvider } from "./context/RequestsContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import RequestorDashboard from "./pages/RequestorDashboard.jsx";
import NewRequest from "./pages/NewRequest.jsx";
import ReviewerDashboard from "./pages/ReviewerDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import SuperUserDashboard from "./pages/SuperUserDashboard.jsx";

function ProtectedRoute({ allow, children }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/" replace />;
  if (!allow.includes(session.role)) return <Navigate to="/" replace />;
  return children;
}

function Shell() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/requestor"
          element={
            <ProtectedRoute allow={["requestor"]}>
              <RequestorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requestor/new"
          element={
            <ProtectedRoute allow={["requestor"]}>
              <NewRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute allow={["dept_head"]}>
              <ReviewerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super"
          element={
            <ProtectedRoute allow={["super_user"]}>
              <SuperUserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RequestsProvider>
        <Shell />
      </RequestsProvider>
    </AuthProvider>
  );
}
