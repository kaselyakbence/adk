import MainPage from "./components/MainPage";
import SpaceshipSVG from "./assets/logo.svg";
import styles from "./app.module.css";
import { baseDevices, DevicesContext } from "./context/DevicesContext";
import { useCallback, useEffect, useState } from "react";
import { Device } from "./types/types";
import { API_URL } from "./secrets";

function App() {
  const [context, setContext] = useState<Device[]>(baseDevices);

  const fetchDevices = useCallback(async () => {
    const fetchData = await fetch(`${API_URL}/device/all`);
    const data = await fetchData.json();
    setContext(data);
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <DevicesContext.Provider value={context}>
      <MainPage refresh={fetchDevices} />
      <img src={SpaceshipSVG} className={styles.img} alt="Spaceship SVG" />
    </DevicesContext.Provider>
  );
}

export default App;
