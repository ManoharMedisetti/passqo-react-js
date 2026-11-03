import { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext({
  isOpen: false,
  searchQuery: "",
  initialMode: "search",
  viewMode: "search",
  setSearchQuery: () => {},
  setViewMode: () => {},
  openSearch: () => {},
  closeSearch: () => {},
});

export function SearchProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("search");

  const openSearch = (initialQuery = "", mode = "search") => {
    if (initialQuery) setSearchQuery(initialQuery);
    setViewMode(mode);
    setIsOpen(true);
  };

  const closeSearch = () => {
    setIsOpen(false);
  };

  // Global keyboard shortcut: Cmd+K / Ctrl+K or '/' when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        } else {
          openSearch("", "search");
        }
      } else if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        openSearch("", "search");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        searchQuery,
        initialMode: viewMode,
        viewMode,
        setSearchQuery,
        setViewMode,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchModal() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchModal must be used within a SearchProvider");
  }
  return context;
}
