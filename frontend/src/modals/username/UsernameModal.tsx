import ReactModal from "react-modal";
import styles from "./usernamemodal.module.css";
import { useContext, useEffect, useState } from "react";
import { UsernameContext } from "../../context/UsernameContext";
import { LocaleContext } from "../../context/LocaleContext";
import { useKeyboardOpen } from "../../hooks/useKeyboardOpen";

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
  const { t } = useContext(LocaleContext);
  const [name, setName] = useState("");
  const keyboardOpen = useKeyboardOpen();

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
      closeTimeoutMS={200}
      className={{
        base: `${styles.modalBox} ${keyboardOpen ? styles.keyboardOpen : ""}`,
        afterOpen: styles.modalBoxAfterOpen,
        beforeClose: styles.modalBoxBeforeClose,
      }}
      overlayClassName={{
        base: styles.overlay,
        afterOpen: styles.overlayAfterOpen,
        beforeClose: styles.overlayBeforeClose,
      }}
      style={{
        content: {
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <div className={styles.header}>
        <h2>{t("usernameModal.welcome")}</h2>
      </div>
      <p>{t("usernameModal.prompt")}</p>
      <input
        type="text"
        className={styles.input}
        placeholder={t("usernameModal.placeholder")}
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
          {t("usernameModal.guestButton")}
        </button>
        <button
          className={styles.save_button}
          onClick={save}
          disabled={!name.trim()}
        >
          {t("usernameModal.saveButton")}
        </button>
      </div>
    </ReactModal>
  );
};

export default UsernameModal;
