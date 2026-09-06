"use client";
import { useContext } from "react";
import {
  FaClock,
  FaInfoCircle,
  FaRegCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import Astronaut from "../../../components/astronaut/Astronaut";
import Navbar from "../../../components/navbar/NavBar";
import shared from "../../../styles/shared.module.css";
import styles from "./page.module.css";
import { LocaleContext } from "../../../context/LocaleContext";

export default function Page() {
  const { t } = useContext(LocaleContext);

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.container}>
        <section className={styles.card}>
          <h1 className={shared.heading}>
            <FaInfoCircle /> {t("about.heading")}
          </h1>
          <p className={shared.text}>{t("about.intro")}</p>

          <h2 className={shared.subheading}>
            <FaUsers /> {t("about.participateHeading")}
          </h2>
          <p className={shared.text}>{t("about.participateBody")}</p>

          <h2 className={shared.subheading}>
            <FaRegCalendarAlt /> {t("about.meetingsHeading")}
          </h2>
          <p className={shared.text}>{t("about.meetingsBody")}</p>
          <p className={styles.callout}>{t("about.meetingsCallout")}</p>
        </section>

        <section className={styles.card}>
          <h1 className={shared.heading}>
            <FaClock /> {t("about.officeHoursHeading")}
          </h1>

          <div className={styles.hours}>
            <div className={shared.infoBox}>
              <FaClock className={shared.infoBoxIcon} />
              <div>
                <p className={shared.infoBoxLabel}>{t("about.tuesday")}</p>
                <p className={shared.infoBoxSub}>{t("about.hoursRange")}</p>
              </div>
            </div>
            <div className={shared.infoBox}>
              <FaClock className={shared.infoBoxIcon} />
              <div>
                <p className={shared.infoBoxLabel}>{t("about.thursday")}</p>
                <p className={shared.infoBoxSub}>{t("about.hoursRange")}</p>
              </div>
            </div>
          </div>

          <p className={shared.text}>{t("about.officeIntro")}</p>
          <ul className={styles.list}>
            <li>{t("about.officeItem1")}</li>
            <li>{t("about.officeItem2")}</li>
            <li>{t("about.officeItem3")}</li>
            <li>{t("about.officeItem4")}</li>
            <li>{t("about.officeItem5")}</li>
            <li>{t("about.officeItem6")}</li>
            <li>{t("about.officeItem7")}</li>
          </ul>

          <p className={shared.text}>{t("about.visitInfo")}</p>
          <p className={shared.text}>
            {t("about.facebookNoticeBefore")}{" "}
            <span className={shared.link}>{t("about.facebookLink")}</span>{" "}
            {t("about.facebookNoticeAfter")}
          </p>
        </section>
      </div>
      <Astronaut />
    </main>
  );
}
