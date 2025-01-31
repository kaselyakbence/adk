import ReactModal from "react-modal";
import { IoMdCloseCircle as CloseIcon } from "react-icons/io";
import styles from "./timermodal.module.css";
import AstronautSVG from "../assets/astronaut.svg";
import "./modal.css";

interface TimerModalProps {
  // isOpen: boolean;
  device: string | null;
  setIsOpen: React.Dispatch<React.SetStateAction<string | null>>;
}

const TimerModal = ({ device, setIsOpen }: TimerModalProps) => {
  return (
    <ReactModal
      isOpen={!!device}
      ariaHideApp={false} //TODO
      onRequestClose={() => setIsOpen(null)}
    >
      <div className={styles.modal_content}>
        <div className={styles.modal_header}>
          <p className={styles.header_text}>{device}</p>
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
            />
            <p className={styles.separator}>:</p>
            <input
              id="minutes"
              inputMode="numeric"
              type="number"
              className={styles.input}
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
          <button className={styles.start_button}>Start</button>
        </div>
      </div>
    </ReactModal>
  );
};

export default TimerModal;
