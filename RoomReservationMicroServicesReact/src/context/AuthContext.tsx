import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { LoginRequest, RegisterRequest, User } from "../models/auth.model";
import { authService } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Normalize data if it's in the old nested format
      if (parsed.user && !parsed.email) {
        const normalized: User = {
          token: parsed.token,
          ...parsed.user,
        };
        localStorage.setItem("user", JSON.stringify(normalized));
        setUser(normalized);
      } else {
        setUser(parsed);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      const userData: User = {
        token: response.token,
        ...response.user,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", response.token);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authService.register(data);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
