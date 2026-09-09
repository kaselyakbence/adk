import { useContext, useEffect, useState } from "react";
import {
  IoMdCheckmarkCircle,
  IoMdCloseCircle,
  IoMdInformationCircle,
} from "react-icons/io";
import styles from "./snackbar.module.css";
import { SnackbarContext } from "../../context/SnackbarContext";

const EXIT_DURATION_MS = 200;

const ICONS = {
  success: IoMdCheckmarkCircle,
  error: IoMdCloseCircle,
  info: IoMdInformationCircle,
};

const CustomSnackbar = () => {
  const { messages, setMessages } = useContext(SnackbarContext);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (messages.length === 0 || !setMessages) return;
    setLeaving(false);
    const hideTimer = setTimeout(() => setLeaving(true), 5000);
    return () => clearTimeout(hideTimer);
  }, [messages, setMessages]);

  useEffect(() => {
    if (!leaving || !setMessages) return;
    const removeTimer = setTimeout(() => {
      setMessages(messages.slice(1));
    }, EXIT_DURATION_MS);
    return () => clearTimeout(removeTimer);
  }, [leaving, messages, setMessages]);

  if (messages.length === 0) return null;

  const front = messages[0];
  const Icon = ICONS[front.status];

  return (
    <div
      // Forces a remount (and so a fresh enter animation) whenever the
      // displayed message actually changes, without needing a ref to track
      // the previous one.
      key={`${front.status}-${front.message}`}
      className={`${styles.snackbar} ${styles[front.status]} ${
        leaving ? styles.leaving : ""
      }`}
    >
      <Icon className={styles.icon} />
      <p>{front.message}</p>
    </div>
  );
};

export default CustomSnackbar;
