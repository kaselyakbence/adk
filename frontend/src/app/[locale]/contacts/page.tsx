"use client";
import { useContext } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaUserCircle,
} from "react-icons/fa";
import Astronaut from "../../../components/astronaut/Astronaut";
import Navbar from "../../../components/navbar/NavBar";
import shared from "../../../styles/shared.module.css";
import styles from "./page.module.css";
import { LocaleContext } from "../../../context/LocaleContext";

const socials = [
  { name: "Instagram", href: "#", icon: FaInstagram },
  { name: "Facebook", href: "#", icon: FaFacebook },
];

export default function Page() {
  const { t } = useContext(LocaleContext);

  const contacts = [
    {
      roleKey: "contacts.roleInfoCenter",
      email: "info@ssv-adk20.example",
      phone: "+49 30 0000 0001",
    },
    {
      roleKey: "contacts.roleResidentTutor",
      email: "tutor@ssv-adk20.example",
      phone: "+49 30 0000 0002",
    },
    {
      roleKey: "contacts.roleCaretaker",
      email: "caretaker@ssv-adk20.example",
      phone: "+49 30 0000 0003",
    },
  ];

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.container}>
        <section className={styles.card}>
          <h1 className={shared.heading}>{t("contacts.heading")}</h1>
          <p className={shared.text}>{t("contacts.intro")}</p>

          <div className={styles.grid}>
            {contacts.map((contact) => (
              <div className={shared.infoBox} key={contact.roleKey}>
                <FaUserCircle className={shared.infoBoxIcon} />
                <div className={styles.contactInfo}>
                  <p className={shared.infoBoxLabel}>{t(contact.roleKey)}</p>
                  <p className={shared.infoBoxSub}>
                    {t("contacts.placeholderName")}
                  </p>
                  <p className={styles.contactLine}>
                    <FaEnvelope /> {contact.email}
                  </p>
                  <p className={styles.contactLine}>
                    <FaPhone /> {contact.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h2 className={styles.followHeading}>
            {t("contacts.followHeading")}
          </h2>
          <div className={styles.socials}>
            {socials.map((social) => (
              <a
                href={social.href}
                className={styles.socialLink}
                key={social.name}
              >
                <social.icon className={styles.socialIcon} />
                {social.name}
              </a>
            ))}
          </div>
        </section>
      </div>
      <Astronaut />
    </main>
  );
}
