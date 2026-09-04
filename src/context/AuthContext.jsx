import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

const USERS_KEY = "pm_users";
const CURRENT_USER_KEY = "pm_current_user";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] =
    useState(() => {
      const saved =
        localStorage.getItem(
          CURRENT_USER_KEY
        );

      return saved
        ? JSON.parse(saved)
        : null;
    });

  const getUsers = () => {
    const saved =
      localStorage.getItem(USERS_KEY);

    return saved ? JSON.parse(saved) : [];
  };

  const register = ({
    name,
    email,
    password,
  }) => {
    const users = getUsers();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      users.find(
        (user) =>
          user.email === normalizedEmail
      )
    ) {
      return {
        success: false,
        message:
          "An account with this email already exists.",
      };
    }

    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      createdAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        ...users,
        user,
      ])
    );

    return {
      success: true,
      message: "Account created successfully.",
    };
  };

  const login = (email, password) => {
    const users = getUsers();

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = users.find(
      (item) =>
        item.email === normalizedEmail &&
        item.password === password
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(safeUser)
    );

    setCurrentUser(safeUser);

    return {
      success: true,
      message: "Login successful.",
    };
  };

  const logout = () => {
    localStorage.removeItem(
      CURRENT_USER_KEY
    );

    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated:
          Boolean(currentUser),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}