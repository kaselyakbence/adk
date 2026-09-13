"use client";
import { useContext } from "react";
import styles from "./page.module.css";
import welcomeImg from "../../assets/pictures/welcome.png";
import Navbar from "../../components/navbar/NavBar";
import Astronaut from "../../components/astronaut/Astronaut";
import PreviewModal from "../../modals/preview/PreviewModal";
import { LocaleContext } from "../../context/LocaleContext";

export default function Page() {
  const { t } = useContext(LocaleContext);

  return (
    <main className={styles.main}>
      <PreviewModal />
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.welcomeHeader}>{t("home.title")}</h1>
        <p className={styles.welcomeText}>{t("home.body")}</p>
        <img
          src={welcomeImg.src}
          alt={t("home.imageAlt")}
          className={styles.welcomeImage}
        />
      </div>
      <Astronaut />
    </main>
  );
}
