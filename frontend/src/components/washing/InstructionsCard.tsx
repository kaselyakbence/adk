import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import styles from "./instructionscard.module.css";

type Tab = "usage" | "info";

const InstructionsCard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("usage");
  const [collapsed, setCollapsed] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

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
          aria-label="Toggle instructions"
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
          Usage &amp; Info
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
            Usage
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "info" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
        </div>
      </div>

      <div className={`${styles.body} ${!collapsed ? styles.open : ""}`}>
        {activeTab === "usage" && (
          <ol className={styles.list}>
            <li>
              After putting your clothes into the machine, selecting the
              fitting program and filling in the detergent, close the door of
              the machine.
            </li>
            <li>
              The machine will now ask you to pay. Insert your laundry card
              into the box on top of the machine. Make sure that the chip is
              on the bottom and in front.
            </li>
            <li>
              First press the + button on the box and then the OK button. As
              soon as &quot;on&quot; appears on the display, remove your
              card.
            </li>
            <li>
              Press the start button on the machine. Come back when the
              machine is finished (the duration is on the display of the
              machine).
            </li>
            <li>
              If you have used a dryer, clean the fluff filter after
              you&apos;re finished! Read the instructions on top of the
              dryers.
            </li>
          </ol>
        )}

        {activeTab === "info" && (
          <div>
            <p className={styles.text}>
              The SSV is running a room with washing machines and dryers for
              you. It is located in the basement between the houses 23 and
              24. There are 5 washing machines and 3 dryers that you can
              use.
            </p>
            <p className={styles.text}>
              To use them, you need a laundry card. You can get it at the{" "}
              <span className={styles.link}>SSV office</span> against a
              deposit of 15&euro;. You also need to charge it with an amount
              of money to be able to wash. For 1&euro;, you get 2 points on
              the card.
            </p>
            <p className={styles.text}>
              Washing costs 4 points (2&euro;), drying costs 2 points
              (1&euro;).
            </p>
            <p className={styles.text}>
              When you move out, you can return your card at the office and
              get your deposit back, if the card is not physically damaged
              (e.g. bent or ruptured). We can&apos;t give you your remaining
              credit back, so make sure that you don&apos;t charge too much.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionsCard;
