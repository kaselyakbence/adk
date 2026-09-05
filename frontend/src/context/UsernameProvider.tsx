"use client";
import { useEffect, useState } from "react";
import { getStoredUsername, UsernameContext } from "./UsernameContext";

const UsernameProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUsername(getStoredUsername());
    setLoaded(true);
  }, []);

  return (
    <UsernameContext.Provider value={{ username, setUsername, loaded }}>
      {children}
    </UsernameContext.Provider>
  );
};

export default UsernameProvider;
