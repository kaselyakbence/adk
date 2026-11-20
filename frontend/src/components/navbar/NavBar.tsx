"use client";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import styles from "./navbar.module.css";
import { UsernameContext } from "../../context/UsernameContext";
import { LocaleContext } from "../../context/LocaleContext";
import { CameraContext } from "../../context/CameraContext";
import { MobileMenuContext } from "../../context/MobileMenuContext";
import UsernameModal from "../../modals/username/UsernameModal";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../LanguageSwitcher";
import { consumeReopenUserMenu } from "../../lib/userMenu";

const navItems = [
  { key: "nav.about", href: "about" },
  { key: "nav.washing", href: "washing" },
  { key: "nav.events", href: "events" },
  { key: "nav.gallery", href: "gallery" },
  { key: "nav.contacts", href: "contacts" },
];

const Navbar = () => {
  const { menuOpen, setMenuOpen } = useContext(MobileMenuContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { locale, t } = useContext(LocaleContext);
  const isActive = (path: string) => pathname === `/${locale}${path}`;
  const { username, loaded: usernameLoaded } = useContext(UsernameContext);
  const displayName = username || "Guest";
  const { cameraOpen } = useContext(CameraContext);
  // True for the first frame after a language switch, so the menu comes up
  // already open instead of replaying its open animation.
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    if (!consumeReopenUserMenu()) return;

    /* eslint-disable react-hooks/set-state-in-effect -- sessionStorage is
       only readable after mount */
    setInstant(true);
    if (window.matchMedia("(max-width: 600px)").matches) setMenuOpen(true);
    else setDropdownOpen(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Two frames: one to paint open with transitions off, one to turn
    // them back on.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setInstant(false));
    });
    return () => cancelAnimationFrame(frame);
  }, [setMenuOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [menuOpen, setMenuOpen]);

  if (cameraOpen) return null;

  return (
    <nav className={styles.navbar} ref={navRef}>
      <div className={styles.logo}>
        <Link href={`/${locale}`}>Alle Der Kosmonauten 20</Link>
      </div>
      <button
        className={styles.menuButton}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={t("nav.toggleNav")}
      >
        ☰
      </button>
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""} ${instant ? styles.instant : ""}`}
      >
        <ul className={styles.navlist}>
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={`/${locale}/${item.href}`}
                id={isActive(`/${item.href}`) ? styles.active : ""}
                onClick={() => setMenuOpen(false)}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.userMenu} ref={userMenuRef}>
          <button
            type="button"
            className={`${styles.usernameButton} ${dropdownOpen ? styles.usernameButtonOpen : ""}`}
            onClick={() => setDropdownOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <FaUserCircle className={styles.userIcon} aria-hidden />
            <span className={styles.usernameText}>{displayName}</span>
            <FaChevronDown className={styles.chevron} aria-hidden />
          </button>
          <div
            className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ""}`}
          >
            <div className={styles.settingRow}>
              <div className={styles.settingText}>
                <span className={styles.settingCaption}>
                  {t("nav.usernameLabel")}
                </span>
                <span className={styles.settingValue}>{displayName}</span>
              </div>
              <button
                type="button"
                className={styles.changeButton}
                onClick={() => {
                  setChangeModalOpen(true);
                  setDropdownOpen(false);
                  setMenuOpen(false);
                }}
              >
                {t("nav.changeButton")}
              </button>
            </div>
            <div className={styles.settingRow}>
              <span>{t("nav.darkMode")}</span>
              <ThemeToggle />
            </div>
            <div className={styles.settingRow}>
              <span>{t("nav.language")}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      <UsernameModal
        isOpen={
          (usernameLoaded && !username && pathname === `/${locale}/washing`) ||
          changeModalOpen
        }
        dismissible={changeModalOpen}
        onClose={() => setChangeModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
