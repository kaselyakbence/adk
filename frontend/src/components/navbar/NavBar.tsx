"use client";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { UsernameContext } from "../../context/UsernameContext";
import { LocaleContext } from "../../context/LocaleContext";
import { CameraContext } from "../../context/CameraContext";
import { MobileMenuContext } from "../../context/MobileMenuContext";
import UsernameModal from "../../modals/username/UsernameModal";

const navItems = [
  { key: "nav.about", href: "about" },
  { key: "nav.washing", href: "washing" },
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
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
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
            className={styles.usernameButton}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {displayName}
          </button>
          <div
            className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ""}`}
          >
            <p className={styles.dropdownLabel}>
              {t("nav.usernameLabel")} {displayName}
            </p>
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
