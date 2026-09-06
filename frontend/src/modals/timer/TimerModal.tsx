import ReactModal from "react-modal";
import { IoMdClose } from "react-icons/io";
import styles from "./timermodal.module.css";
import "../modal.css";
import { useCallback, useContext, useRef, useState } from "react";
import { DevicesContext } from "../../context/DevicesContext";
import { API_URL } from "../../secrets";
import { SnackbarContext } from "../../context/SnackbarContext";
import { getStoredUsername } from "../../context/UsernameContext";
import { enqueueUpdate, registerBackgroundSync } from "../../lib/offlineQueue";
import { subscribeToPush, MACHINE_STARTED_EVENT } from "../../lib/push";
import { LocaleContext } from "../../context/LocaleContext";

interface TimerModalProps {
  deviceID: number | null;
  setIsOpen: React.Dispatch<React.SetStateAction<number | null>>;
  refresh: () => Promise<void>;
}

const TimerModal = ({ deviceID, setIsOpen, refresh }: TimerModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState<{ hours?: string; minutes?: string }>({});

  const { messages, setMessages } = useContext(SnackbarContext);
  const { t } = useContext(LocaleContext);

  const device = useContext(DevicesContext).find((d) => d.id == deviceID);

  const closeModal = useCallback(() => {
    setIsOpen(null);
    setInput({});
  }, [setIsOpen]);

  const startOnClick = useCallback(async () => {
    if (!deviceID) return;

    const hours = parseInt(input.hours || "0");
    const minutes = parseInt(input.minutes || "0");
    // Computed now, at the moment Start is actually pressed - if this ends
    // up queued offline, the server will honor this exact moment instead of
    // whenever the request happens to arrive, so the cycle doesn't drift.
    const start_date = new Date().toISOString();
    const end_date = new Date(
      Date.now() + (hours * 60 + minutes) * 60 * 1000,
    ).toISOString();

    const body = {
      hours,
      minutes,
      owner: getStoredUsername() || "Unknown",
      start_date,
      end_date,
    };
    const url = `${API_URL}/device/${deviceID}/update`;
    closeModal();

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      refresh();

      if (res.status == 201) {
        subscribeToPush(deviceID);
        window.dispatchEvent(new Event(MACHINE_STARTED_EVENT));
      }

      if (setMessages) {
        if (res.status == 201)
          setMessages([
            ...messages,
            { status: "success", message: t("timerModal.successMessage") },
          ]);
        else {
          setMessages([
            ...messages,
            { status: "error", message: t("timerModal.errorMessage") },
          ]);
        }
      }
    } catch (_) {
      // Likely offline - queue it instead of just failing outright.
      await enqueueUpdate({ deviceId: deviceID, url, body, queuedAt: Date.now() });
      registerBackgroundSync();

      if (setMessages)
        setMessages([
          ...messages,
          { status: "info", message: t("timerModal.offlineMessage") },
        ]);
    }
  }, [deviceID, input, refresh, closeModal, messages, setMessages, t]);

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
          {device?.type === "dryer" ? t("timerModal.dryer") : t("timerModal.washingMachine")}{" "}
          {device?.number}
        </p>
        <button
          className={styles.closeIcon}
          onClick={closeModal}
          aria-label={t("timerModal.closeAria")}
        >
          <IoMdClose />
        </button>
      </div>

      <p className={styles.label}>{t("timerModal.setTimer")}</p>
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
          {t("timerModal.close")}
        </button>
        <button className={styles.startButton} onClick={startOnClick}>
          {t("timerModal.start")}
        </button>
      </div>
    </ReactModal>
  );
};

export default TimerModal;
