import { type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CustomersList from "./pages/Customer";
import CreateCustomer from "./pages/CreateCustomer";
import UpdateCustomer from "./pages/UpdateCustomer";
import CustomerPage from "./pages/ViewCustomer";
import NewOrderPage from "./pages/CreateOrder";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import EditOrderPage from "./pages/EditOrder";
import OrdersList from "./pages/OrdersListPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductsList from "./pages/ProductListing";
import CreateProductPage from "./pages/CreateProduct";
import EditProductPage from "./pages/EditProduct";
import ListUsersPage from "./pages/Users";
import CreateUserPage from "./pages/CreateUserPage";
import EditUserPage from "./pages/EditUserPage";
// add more page imports as needed

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    // you can return a spinner here instead
    return null;
  }
  return user ? children : <Navigate to="/login" />;
}

function AdminProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    // you can return a spinner here instead
    return null;
  }
  return user?.role === "admin" ? children : <Navigate to="/" />;
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
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <ListUsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/new"
          element={
            <AdminProtectedRoute>
              <CreateUserPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/users/edit/:id"
          element={
            <AdminProtectedRoute>
              <EditUserPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <CreateProductPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/edit/:productId"
          element={
            <ProtectedRoute>
              <EditProductPage />
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

        <Route
          path="/customers/:customerId/orders/new"
          element={
            <ProtectedRoute>
              <NewOrderPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/:customerId/orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers/:customerId/orders/edit/:orderId"
          element={
            <ProtectedRoute>
              <EditOrderPage />
            </ProtectedRoute>
          }
        />

        {/* add more protected routes here */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <NotFoundPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
