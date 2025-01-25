import { useContext } from "react";
import { DevicesContext } from "../context/DevicesContext";
import styles from "./mainpage.module.css";
import Countdown from "./countdown/Countdown";

const MainPage = () => {
  const devices = useContext(DevicesContext);

  return (
    <>
      <div className={styles.washers}>
        <div className={styles.washer_header}>
          <p className={styles.washer_header_left}>Washing machines</p>
          <p className={styles.washer_header_right}>0/5</p>
        </div>
        {devices &&
          devices
            .filter((d) => d.type == "washer")
            .map((d) => (
              <div className={styles.item} key={d.id}>
                <div>{d.name}</div>
                <Countdown />
              </div>
            ))}
      </div>
      <div>
        <div className={styles.washer_header}>
          <p className={styles.washer_header_left}>Dryers</p>
          <p className={styles.washer_header_right}>0/3</p>
        </div>
        {devices &&
          devices
            .filter((d) => d.type == "dryer")
            .map((d) => (
              <div className={styles.item} key={d.id}>
                <div>{d.name}</div>
                <Countdown />
              </div>
            ))}
      </div>
    </>
  );
};

export default MainPage;
