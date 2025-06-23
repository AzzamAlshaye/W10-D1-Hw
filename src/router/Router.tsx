// src/router/Router.tsx

import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../service/auth.service";

// Layouts
function PublicLayout() {
  return <Outlet />;
}
function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../Auth/LoginPage";
import Register from "../Auth/Register";
import WeatherPage from "../pages/WeatherPage";
import HistoryPage from "../pages/HistoryPage";

const router = createBrowserRouter([
  {
    // PUBLIC routes under AuthProvider
    element: (
      <AuthProvider>
        <PublicLayout />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    // PROTECTED routes also under AuthProvider
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: [
      { path: "weather", element: <WeatherPage /> },
      { path: "history", element: <HistoryPage /> },
    ],
  },
]);

export default function AppRouter() {
  // No outer AuthProvider here
  return <RouterProvider router={router} />;
}
