"use client";
import { useContext, useState } from "react";
import ReactModal from "react-modal";
import { MdConstruction } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { LocaleContext } from "../../context/LocaleContext";
import { useVisualViewportHeight } from "../../hooks/useVisualViewportHeight";
import styles from "./previewmodal.module.css";

const PreviewModal = () => {
  const { t } = useContext(LocaleContext);
  const [isOpen, setIsOpen] = useState(true);
  const viewportHeight = useVisualViewportHeight();

  const close = () => setIsOpen(false);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={close}
      ariaHideApp={false}
      contentLabel="Preview Notice"
      closeTimeoutMS={200}
      className={{
        base: styles.modalBox,
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
          top: viewportHeight !== null ? `${viewportHeight / 2}px` : undefined,
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
        },
      }}
    >
      <div className={styles.header}>
        <MdConstruction className={styles.icon} />
        <button
          type="button"
          className={styles.closeButton}
          onClick={close}
          aria-label={t("previewModal.closeAria")}
        >
          <IoMdClose />
        </button>
      </div>
      <p className={styles.text}>{t("previewModal.text")}</p>
      <button type="button" className={styles.okButton} onClick={close}>
        {t("previewModal.ok")}
      </button>
    </ReactModal>
  );
};

export default PreviewModal;
