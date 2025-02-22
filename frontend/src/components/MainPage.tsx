import { useContext, useMemo, useState } from "react";
import { DevicesContext } from "../context/DevicesContext";
import styles from "./mainpage.module.css";
import Countdown from "./countdown/Countdown";
import { MdCameraswitch } from "react-icons/md";
import TimerModal from "../modals/TimerModal";

interface MainPageProps {
  refresh: () => Promise<void>;
}

const MainPage = ({ refresh }: MainPageProps) => {
  const [chosenDevice, setChosenDevice] = useState<number | null>(null);

  const devices = useContext(DevicesContext);

  const freeDevices = useMemo(() => {
    const now = new Date();
    const washers = devices
      .filter((d) => d.type === "washer")
      .filter((d) => d.end_date && new Date(d.end_date) < now).length;

    const dryers = devices
      .filter((d) => d.type === "dryer")
      .filter((d) => d.end_date && new Date(d.end_date) < now).length;

    return {
      washers,
      dryers,
    };
  }, [devices]);

  return (
    <>
      <div className={styles.header}>
        <p className={styles.header_text}>ADK Washing</p>
        <div className={styles.circle}>
          <MdCameraswitch className={styles.icon} />
        </div>
      </div>
      <div className={styles.washers}>
        <div className={styles.washer_header}>
          <p className={styles.washer_header_left}>Washing machines</p>
          <p className={styles.washer_header_right}>{freeDevices.washers}/5</p>
        </div>
        {devices &&
          devices
            .filter((d) => d.type == "washer")
            .sort((a, b) => a.id - b.id)
            .map((d) => (
              <div
                className={styles.item}
                key={d.id}
                onClick={() => setChosenDevice(d.id)}
              >
                <div>Washer {d.number}</div>
                <Countdown time={d.end_date} />
              </div>
            ))}
      </div>
      <div>
        <div className={styles.washer_header}>
          <p className={styles.washer_header_left}>Dryers</p>
          <p className={styles.washer_header_right}>{freeDevices.dryers}/3</p>
        </div>
        {devices &&
          devices
            .filter((d) => d.type == "dryer")
            .map((d) => (
              <div
                className={styles.item}
                key={d.id}
                onClick={() => setChosenDevice(d.number)}
              >
                <div>Dryer {d.number}</div>
                <Countdown time={d.end_date} />
              </div>
            ))}
      </div>
      <TimerModal
        deviceID={chosenDevice}
        setIsOpen={setChosenDevice}
        refresh={refresh}
      />
    </>
  );
};

export default MainPage;
