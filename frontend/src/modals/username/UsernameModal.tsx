import ReactModal from "react-modal";
import styles from "./usernamemodal.module.css";
import { useContext, useEffect, useState } from "react";
import { UsernameContext } from "../../context/UsernameContext";

interface UsernameModalProps {
  isOpen: boolean;
  dismissible?: boolean;
  onClose?: () => void;
}

const UsernameModal = ({
  isOpen,
  dismissible = false,
  onClose,
}: UsernameModalProps) => {
  const { setUsername } = useContext(UsernameContext);
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) setName("");
  }, [isOpen]);

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("username", trimmed);
    setUsername(trimmed);
    onClose?.();
  };

  const continueAsGuest = () => {
    sessionStorage.setItem("username", "Guest");
    setUsername("Guest");
    onClose?.();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      ariaHideApp={false}
      contentLabel="Username Modal"
      onRequestClose={dismissible ? onClose : undefined}
      shouldCloseOnOverlayClick={dismissible}
      shouldCloseOnEsc={dismissible}
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
      <div className={styles.header}>
        <h2>Welcome!</h2>
      </div>
      <p>Please use your name from the groupchat</p>
      <input
        type="text"
        className={styles.input}
        placeholder="Your name"
        value={name}
        maxLength={30}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
        }}
        autoFocus
      />
      <div className={styles.buttons}>
        <button className={styles.guest_button} onClick={continueAsGuest}>
          Continue as guest
        </button>
        <button
          className={styles.save_button}
          onClick={save}
          disabled={!name.trim()}
        >
          Save
        </button>
      </div>
    </ReactModal>
  );
};

export default UsernameModal;
