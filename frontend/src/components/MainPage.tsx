import { useContext, useState } from "react";
import { DevicesContext } from "../context/DevicesContext";
import styles from "./mainpage.module.css";
import Countdown from "./countdown/Countdown";
import { MdCameraswitch } from "react-icons/md";
import TimerModal from "../modals/TimerModal";

const MainPage = () => {
  // const [isModalOpen, setIsModalOpen] = useState(true);
  const [chosenDevice, setChosenDevice] = useState<string | null>(null);

  const devices = useContext(DevicesContext);

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
          <p className={styles.washer_header_right}>0/5</p>
        </div>
        {devices &&
          devices
            .filter((d) => d.type == "washer")
            .map((d) => (
              <div
                className={styles.item}
                key={d.id}
                onClick={() => setChosenDevice(d.name)}
              >
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
              <div
                className={styles.item}
                key={d.id}
                onClick={() => setChosenDevice(d.name)}
              >
                <div>{d.name}</div>
                <Countdown />
              </div>
            ))}
      </div>
      <TimerModal device={chosenDevice} setIsOpen={setChosenDevice} />
    </>
  );
};

export default MainPage;
