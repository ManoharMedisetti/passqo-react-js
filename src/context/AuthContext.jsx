import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  isOpen: false,
  mode: "signin", // "signin" | "signup"
  openAuth: () => {},
  closeAuth: () => {},
  setMode: () => {},
});

export function AuthProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("signin");

  const openAuth = (initialMode = "signin") => {
    setMode(initialMode);
    setIsOpen(true);
  };

  const closeAuth = () => {
    setIsOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isOpen,
        mode,
        openAuth,
        closeAuth,
        setMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthProvider");
  }
  return context;
}

