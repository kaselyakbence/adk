import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import styles from "./instructionscard.module.css";

const InstructionsCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.card}>
      <div
        className={styles.header}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <FaChevronDown
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
        <h2 className={`${styles.title} ${styles.headingCyan}`}>Usage</h2>
      </div>

      <div className={`${styles.content} ${open ? styles.open : ""}`}>
        <ol className={styles.list}>
          <li>
            After putting your clothes into the machine, selecting the fitting
            program and filling in the detergent,{" "}
            <strong>close the door of the machine</strong>.
          </li>
          <li>
            The machine will now ask you to pay. Insert your laundry card into
            the box on top of the machine. Make sure that the{" "}
            <strong>chip is on the bottom and in front</strong>.
          </li>
          <li>
            First press the <strong>+</strong> button on the box and then the{" "}
            <strong>OK</strong> button. As soon as &quot;on&quot; appears on the
            display, remove your card.
          </li>
          <li>
            Press the start button on the machine. Come back when the machine is
            finished (the duration is on the display of the machine).
          </li>
          <li>
            If you have used a dryer, <strong>clean the fluff filter</strong>{" "}
            after you&apos;re finished! Read the instructions on top of the
            dryers.
          </li>
        </ol>

        <p className={styles.text}>
          The SSV is running a room with washing machines and dryers for you. It
          is located in the basement between the houses 23 and 24. There are 5
          washing machines and 3 dryers that you can use.
        </p>
        <p className={styles.text}>
          To use them, you need a laundry card. You can get it at the{" "}
          <span className={styles.link}>SSV office</span> against a{" "}
          <strong>deposit of 15&euro;</strong>. You also need to charge it with
          an amount of money to be able to wash. For 1&euro;, you get 2 points
          on the card.
        </p>
        <p className={styles.text}>
          Washing costs <strong>4 points (2&euro;)</strong>, drying costs{" "}
          <strong>2 points (1&euro;)</strong>.
        </p>
        <p className={styles.text}>
          When you move out, you can return your card at the office and get your
          deposit back, <strong>if the card is not physically damaged</strong>{" "}
          (e.g. bent or ruptured). We can&apos;t give you your remaining credit
          back, so make sure that you don&apos;t charge too much.
        </p>
      </div>
    </div>
  );
};

export default InstructionsCard;
