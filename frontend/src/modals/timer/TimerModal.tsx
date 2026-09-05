import ReactModal from "react-modal";
import { IoMdClose } from "react-icons/io";
import styles from "./timermodal.module.css";
import "../modal.css";
import { useCallback, useContext, useRef, useState } from "react";
import { DevicesContext } from "../../context/DevicesContext";
import { API_URL } from "../../secrets";
import { SnackbarContext } from "../../context/SnackbarContext";
import { getStoredUsername } from "../../context/UsernameContext";

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
          owner: getStoredUsername() || "Unknown",
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
      className={styles.modalBox}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          border: "none",
          background: "none",
          padding: 0,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <div className={styles.header}>
        <p className={styles.title}>
          {device?.type === "dryer" ? "Dryer" : "Washing Machine"}{" "}
          {device?.number}
        </p>
        <button
          className={styles.closeIcon}
          onClick={closeModal}
          aria-label="Close"
        >
          <IoMdClose />
        </button>
      </div>

      <p className={styles.label}>Set a timer</p>
      <div className={styles.inputs}>
        <input
          id="hour"
          type="number"
          className={styles.input}
          inputMode="numeric"
          placeholder="HH"
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
        <span className={styles.separator}>:</span>
        <input
          ref={inputRef}
          id="minutes"
          inputMode="numeric"
          placeholder="MM"
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

      <div className={styles.buttons}>
        <button onClick={closeModal} className={styles.closeButton}>
          Close
        </button>
        <button className={styles.startButton} onClick={startOnClick}>
          Start
        </button>
      </div>
    </ReactModal>
  );
};

export default TimerModal;
