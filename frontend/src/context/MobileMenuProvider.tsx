"use client";
import { useState } from "react";
import { MobileMenuContext } from "./MobileMenuContext";

const MobileMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ menuOpen, setMenuOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

export default MobileMenuProvider;
