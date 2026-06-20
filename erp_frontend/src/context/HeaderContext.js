import React, { createContext, useState, useContext } from "react";

// Create the context
const HeaderContext = createContext();

// Provider component
export function HeaderProvider({ children }) {
  const [selectedMainHeader, setSelectedMainHeader] = useState(null);
  const [selectedSubHeader, setSelectedSubHeader] = useState(null);

  return (
    <HeaderContext.Provider
      value={{
        selectedMainHeader,
        setSelectedMainHeader,
        selectedSubHeader,
        setSelectedSubHeader,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

// Custom hook to use context
export function useHeader() {
  return useContext(HeaderContext);
}
