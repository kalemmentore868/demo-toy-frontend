import { type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CustomersList from "./pages/Customer";
import CreateCustomer from "./pages/CreateCustomer";
import UpdateCustomer from "./pages/UpdateCustomer";
import CustomerPage from "./pages/ViewCustomer";
// add more page imports as needed

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    // you can return a spinner here instead
    return null;
  }
  return user ? children : <Navigate to="/login" />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/new"
          element={
            <ProtectedRoute>
              <CreateCustomer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/edit/:customerId"
          element={
            <ProtectedRoute>
              <UpdateCustomer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/:customerId"
          element={
            <ProtectedRoute>
              <CustomerPage />
            </ProtectedRoute>
          }
        />
        {/* add more protected routes here */}
      </Routes>
    </BrowserRouter>
  );
}
