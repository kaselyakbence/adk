import { useContext, useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import styles from "./instructionscard.module.css";
import { LocaleContext } from "../../context/LocaleContext";

type Tab = "usage" | "info";

const InstructionsCard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("usage");
  const [collapsed, setCollapsed] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const { t } = useContext(LocaleContext);

  useEffect(() => {
    if (!collapsed) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [collapsed, activeTab]);

  const toggleCollapse = () => setCollapsed((isCollapsed) => !isCollapsed);

  return (
    <div className={styles.card} ref={cardRef}>
      <div className={styles.headerRow}>
        <button
          className={styles.chevronButton}
          onClick={toggleCollapse}
          aria-label={t("instructionsCard.toggleAria")}
        >
          <FaChevronDown
            className={`${styles.chevron} ${
              !collapsed ? styles.chevronOpen : ""
            }`}
          />
        </button>

        <button
          className={`${styles.collapseLabel} ${
            !collapsed ? styles.collapseLabelHidden : ""
          }`}
          onClick={toggleCollapse}
        >
          {t("instructionsCard.usageInfoLabel")}
        </button>

        <div
          className={`${styles.tabs} ${collapsed ? styles.tabsHidden : ""}`}
        >
          <button
            className={`${styles.tab} ${
              activeTab === "usage" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab("usage")}
          >
            {t("instructionsCard.usageTab")}
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "info" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab("info")}
          >
            {t("instructionsCard.infoTab")}
          </button>
        </div>
      </div>

      <div className={`${styles.body} ${!collapsed ? styles.open : ""}`}>
        {activeTab === "usage" && (
          <ol className={styles.list}>
            <li>{t("instructionsCard.usageStep1")}</li>
            <li>{t("instructionsCard.usageStep2")}</li>
            <li>{t("instructionsCard.usageStep3")}</li>
            <li>{t("instructionsCard.usageStep4")}</li>
            <li>{t("instructionsCard.usageStep5")}</li>
          </ol>
        )}

        {activeTab === "info" && (
          <div>
            <p className={styles.text}>{t("instructionsCard.infoParagraph1")}</p>
            <p className={styles.text}>
              {t("instructionsCard.infoParagraph2Before")}{" "}
              <span className={styles.link}>
                {t("instructionsCard.infoParagraph2Link")}
              </span>{" "}
              {t("instructionsCard.infoParagraph2After")}
            </p>
            <p className={styles.text}>{t("instructionsCard.infoParagraph3")}</p>
            <p className={styles.text}>{t("instructionsCard.infoParagraph4")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionsCard;
