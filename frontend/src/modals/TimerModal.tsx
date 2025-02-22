import ReactModal from "react-modal";
import { IoMdCloseCircle as CloseIcon } from "react-icons/io";
import styles from "./timermodal.module.css";
import AstronautSVG from "../assets/astronaut.svg";
import "./modal.css";
import { useCallback, useContext, useState } from "react";
import { DevicesContext } from "../context/DevicesContext";
import { API_URL } from "../secrets";

interface TimerModalProps {
  deviceID: number | null;
  setIsOpen: React.Dispatch<React.SetStateAction<number | null>>;
  refresh: () => Promise<void>;
}

const TimerModal = ({ deviceID, setIsOpen, refresh }: TimerModalProps) => {
  const [input, setInput] = useState<{ hours?: string; minutes?: string }>({});

  const device = useContext(DevicesContext).find((d) => d.id == deviceID);

  const startOnClick = useCallback(async () => {
    if (deviceID) {
      const body = {
        hours: parseInt(input.hours || "0"),
        minutes: parseInt(input.minutes || "0"),
      };

      await fetch(`${API_URL}/device/${deviceID}/update`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      refresh();
    }

    setIsOpen(null);
  }, [setIsOpen, deviceID, input, refresh]);

  return (
    <ReactModal
      isOpen={!!deviceID}
      ariaHideApp={false} //TODO
      onRequestClose={() => setIsOpen(null)}
    >
      <div className={styles.modal_content}>
        <div className={styles.modal_header}>
          <p className={styles.header_text}>
            {device?.type == "dryer" ? "Dryer " : "Washin machine"}{" "}
            {device?.number}
          </p>
          <CloseIcon
            onClick={() => setIsOpen(null)}
            className={styles.close_icon}
          />
        </div>
        <div className={styles.modal_body}>
          <div className={styles.inputs}>
            <input
              id="hour"
              type="number"
              className={styles.input}
              inputMode="numeric"
              value={input.hours}
              max={3}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                if (val < 4 && val > -1)
                  setInput({ ...input, hours: e.target.value });
              }}
            />
            <p className={styles.separator}>:</p>
            <input
              id="minutes"
              inputMode="numeric"
              type="number"
              className={styles.input}
              value={input.minutes}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                if (val < 61 && val > -1)
                  setInput({ ...input, minutes: e.target.value });
              }}
            />
          </div>
          <img src={AstronautSVG} className={styles.img} alt="Spaceship SVG" />
        </div>
        <div className={styles.buttons}>
          <button
            onClick={() => setIsOpen(null)}
            className={styles.close_button}
          >
            Close
          </button>
          <button className={styles.start_button} onClick={startOnClick}>
            Start
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default TimerModal;
