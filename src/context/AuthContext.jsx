import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  isOpen: false,
  mode: "signin", // "signin" | "signup"
  isOrganizer: false,
  redirectUrl: null,
  openAuth: () => {},
  closeAuth: () => {},
  setMode: () => {},
  setIsOrganizer: () => {},
});

export function AuthProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("signin");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);

  const openAuth = (initialMode = "signin", options = {}) => {
    setMode(initialMode);
    if (typeof options === "object" && options !== null) {
      setIsOrganizer(Boolean(options.isOrganizer));
      setRedirectUrl(options.redirectUrl || null);
    } else {
      setIsOrganizer(false);
      setRedirectUrl(null);
    }
    setIsOpen(true);
  };

  const closeAuth = () => {
    setIsOpen(false);
    setIsOrganizer(false);
    setRedirectUrl(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isOpen,
        mode,
        isOrganizer,
        redirectUrl,
        openAuth,
        closeAuth,
        setMode,
        setIsOrganizer,
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

