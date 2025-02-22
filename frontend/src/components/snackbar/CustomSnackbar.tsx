import { useContext, useEffect } from "react";
import styles from "./snackbar.module.css";
import { SnackbarContext } from "../../context/SnackbarContext";

const CustomSnackbar = () => {
  const { messages, setMessages } = useContext(SnackbarContext);

  useEffect(() => {
    if (messages.length > 0 && setMessages) {
      setTimeout(() => {
        setMessages(messages.slice(1));
      }, 5000);
    }
  }, [messages, setMessages]);

  if (messages.length > 0) {
    return (
      <div className={`${styles.snackbar}  ${styles[messages[0].status]}`}>
        <p>{messages[0].message}</p>
      </div>
    );
  }
};

export default CustomSnackbar;
