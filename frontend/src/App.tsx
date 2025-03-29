import MainPage from "./components/MainPage";
import SpaceshipSVG from "./assets/logo.svg";
import styles from "./app.module.css";
import { baseDevices, DevicesContext } from "./context/DevicesContext";
import { useCallback, useEffect, useState } from "react";
import { Device, SnackbarItem } from "./types/types";
import { API_URL } from "./secrets";
import { SnackbarContext } from "./context/SnackbarContext";

function App() {
  const [deviceContext, setDeviceContext] = useState<Device[]>(baseDevices);
  const [snackbarMessages, setSnackbarMessages] = useState<SnackbarItem[]>([]);

  const fetchDevices = useCallback(async () => {
    const fetchData = await fetch(`${API_URL}/device/all`, {
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    const data = await fetchData.json();
    setDeviceContext(data);
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <DevicesContext.Provider value={deviceContext}>
      <SnackbarContext.Provider
        value={{ messages: snackbarMessages, setMessages: setSnackbarMessages }}
      >
        <MainPage refresh={fetchDevices} />
        <img src={SpaceshipSVG} className={styles.img} alt="Spaceship SVG" />
      </SnackbarContext.Provider>
    </DevicesContext.Provider>
  );
}

export default App;
