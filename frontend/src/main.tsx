import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { baseDevices, DevicesContext } from "./context/DevicesContext.ts";
import "./main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DevicesContext.Provider value={baseDevices}>
      <App />
    </DevicesContext.Provider>
  </StrictMode>
);
