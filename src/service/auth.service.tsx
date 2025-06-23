// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { FC, ReactNode } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import { authService } from "../controllers/auth.controller";
import type { SignInDTO } from "../models/Auth.model";

interface AuthContextType {
  login: (data: SignInDTO) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthenticated(true);
    setLoading(false);

    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token invalid/expired: clear and redirect
          localStorage.removeItem("token");
          setAuthenticated(false);
          toast.info("Session expired. Please log in again.");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptorId);
  }, [navigate]);

  const login = async ({ email, password }: SignInDTO) => {
    try {
      const { token } = await authService.signin({ email, password });
      localStorage.setItem("token", token);
      setAuthenticated(true);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err; // ← re-throw so page’s catch skips the success toast
    }
  };

  const logout = async () => {
    try {
      await authService.signout();
    } catch (err: any) {
      // If token expired, treat as successful logout
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || "Logout failed");
        return;
      }
    } finally {
      localStorage.removeItem("token");
      setAuthenticated(false);
      setUserRole(undefined);
      toast.info("Signed out");
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, isAuthenticated, isLoading, userRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
