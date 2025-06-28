import React from "react";
import styles from "./page.module.css";
import welcomeImg from "../../assets/pictures/welcome.png";
import Navbar from "../../components/navbar/NavBar";

export default function Page() {
  return (
    <main className={styles.main}>
      <Navbar />
      <h1 className={styles.welcomeHeader}>Welcome to ADK</h1>
      <p className={styles.welcomeText}>
        Welcome to the new homepage of the SSV of Allee der Kosmonauten 20! Here
        you can find information about the dormitory and of course about the
        offers of the SSV.
      </p>

      <img src={welcomeImg.src} alt="Welcome" className={styles.welcomeImage} />
    </main>
  );
}
