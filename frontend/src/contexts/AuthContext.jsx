import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("reprop_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (email) => {
    // Mock login logic
    const fakeUser = { id: "1", name: "Demo User", email };
    setUser(fakeUser);
    localStorage.setItem("reprop_user", JSON.stringify(fakeUser));
  };

  const signup = (name, email) => {
    // Mock signup logic
    const fakeUser = { id: "1", name, email };
    setUser(fakeUser);
    localStorage.setItem("reprop_user", JSON.stringify(fakeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("reprop_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
