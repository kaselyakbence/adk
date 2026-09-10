import { createContext, Dispatch, SetStateAction } from "react";

interface MobileMenuContextType {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const MobileMenuContext = createContext<MobileMenuContextType>({
  menuOpen: false,
  setMenuOpen: () => {},
});
