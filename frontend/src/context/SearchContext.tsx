"use client";
import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext({
  search: "",
  setSearch: (_: string) => {},
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState("");
  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
