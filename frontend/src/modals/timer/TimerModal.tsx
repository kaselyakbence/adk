import ReactModal from "react-modal";
import { IoMdCloseCircle as CloseIcon } from "react-icons/io";
import styles from "./timermodal.module.css";
import AstronautSVG from "../../assets/astronaut.svg";
import "../modal.css";
import { useCallback, useContext, useRef, useState } from "react";
import { DevicesContext } from "../../context/DevicesContext";
import { API_URL } from "../../secrets";
import { SnackbarContext } from "../../context/SnackbarContext";

interface TimerModalProps {
  deviceID: number | null;
  setIsOpen: React.Dispatch<React.SetStateAction<number | null>>;
  refresh: () => Promise<void>;
}

const TimerModal = ({ deviceID, setIsOpen, refresh }: TimerModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState<{ hours?: string; minutes?: string }>({});

  const { messages, setMessages } = useContext(SnackbarContext);

  const device = useContext(DevicesContext).find((d) => d.id == deviceID);

  const closeModal = useCallback(() => {
    setIsOpen(null);
    setInput({});
  }, [setIsOpen]);

  const startOnClick = useCallback(async () => {
    try {
      if (deviceID) {
        const body = {
          hours: parseInt(input.hours || "0"),
          minutes: parseInt(input.minutes || "0"),
          owner: localStorage.getItem("username") || "Unknown",
        };
        closeModal();

        const res = await fetch(`${API_URL}/device/${deviceID}/update`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        });
        refresh();

        if (setMessages) {
          if (res.status == 201)
            setMessages([
              ...messages,
              { status: "success", message: "Successfully updated" },
            ]);
          else {
            setMessages([
              ...messages,
              { status: "error", message: "An error occured" },
            ]);
          }
        }
      }
    } catch (_) {
      if (setMessages)
        setMessages([
          ...messages,
          { status: "error", message: "An error occured" },
        ]);
    }
  }, [deviceID, input, refresh, closeModal, messages, setMessages]);

  return (
    <ReactModal
      isOpen={!!deviceID}
      ariaHideApp={false} //TODO
      onRequestClose={closeModal}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <div className={styles.modal_content}>
        <div className={styles.modal_header}>
          <p className={styles.header_text}>
            {device?.type == "dryer" ? "Dryer " : "Washing machine"}
            {device?.number}
          </p>
          <CloseIcon onClick={closeModal} className={styles.close_icon} />
        </div>
        <div className={styles.modal_body}>
          <div className={styles.inputs}>
            <input
              id="hour"
              type="number"
              className={styles.input}
              inputMode="numeric"
              placeholder="Hours"
              value={input.hours}
              max={3}
              onChange={(e) => {
                const v = e.target.value;
                const num = parseInt(v.charAt(v.length - 1)) || 0;
                if (num < 4 && num > -1) {
                  setInput({
                    ...input,
                    hours: v.length === 1 ? v : v.charAt(1),
                  });
                  inputRef.current?.focus();
                }
              }}
              autoFocus
            />
            <p className={styles.separator}>:</p>
            <input
              ref={inputRef}
              id="minutes"
              inputMode="numeric"
              placeholder="Minutes"
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
          <img
            src={AstronautSVG.src}
            className={styles.img}
            alt="Spaceship SVG"
          />
        </div>
        <div className={styles.buttons}>
          <button onClick={closeModal} className={styles.close_button}>
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
