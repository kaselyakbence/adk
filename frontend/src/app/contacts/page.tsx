import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaUserCircle,
} from "react-icons/fa";
import Astronaut from "../../components/astronaut/Astronaut";
import Navbar from "../../components/navbar/NavBar";
import shared from "../../styles/shared.module.css";
import styles from "./page.module.css";

const contacts = [
  {
    role: "Info Center",
    name: "Placeholder Name",
    email: "info@ssv-adk20.example",
    phone: "+49 30 0000 0001",
  },
  {
    role: "Resident Tutor",
    name: "Placeholder Name",
    email: "tutor@ssv-adk20.example",
    phone: "+49 30 0000 0002",
  },
  {
    role: "Caretaker",
    name: "Placeholder Name",
    email: "caretaker@ssv-adk20.example",
    phone: "+49 30 0000 0003",
  },
];

const socials = [
  { name: "Instagram", href: "#", icon: FaInstagram },
  { name: "Facebook", href: "#", icon: FaFacebook },
];

export default function Page() {
  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.container}>
        <section className={styles.card}>
          <h1 className={shared.heading}>Contacts</h1>
          <p className={shared.text}>
            Placeholder contacts for now &mdash; reach out to the SSV office
            during opening hours for anything urgent.
          </p>

          <div className={styles.grid}>
            {contacts.map((contact) => (
              <div className={shared.infoBox} key={contact.role}>
                <FaUserCircle className={shared.infoBoxIcon} />
                <div className={styles.contactInfo}>
                  <p className={shared.infoBoxLabel}>{contact.role}</p>
                  <p className={shared.infoBoxSub}>{contact.name}</p>
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

          <h2 className={styles.followHeading}>Follow the SSV</h2>
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
