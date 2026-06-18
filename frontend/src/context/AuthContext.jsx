import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getCurrentUser, loginAdmin, logoutAdmin } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await getCurrentUser();

      if (data.is_authenticated && data.user?.is_staff) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  async function login(username, password) {
    const data = await loginAdmin(username, password);
    setUser(data.user);
    return data;
  }

  async function logout() {
    await logoutAdmin();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAdmin: Boolean(user?.is_staff),
      isCheckingAuth,
      login,
      logout,
      refreshUser,
    }),
    [user, isCheckingAuth, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
