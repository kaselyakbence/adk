"use client";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { UsernameContext } from "../../context/UsernameContext";
import UsernameModal from "../../modals/username/UsernameModal";

const navItems = [
  { name: "about", href: "about" },
  { name: "washing", href: "washing" },
  { name: "gallery", href: "gallery" },
  { name: "contacts", href: "contacts" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { username, loaded: usernameLoaded } = useContext(UsernameContext);

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

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Alle Der Kosmonauten 20</Link>
      </div>
      <button
        className={styles.menuButton}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
        <ul className={styles.navlist}>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={`/${item.href}`}
                id={isActive(`/${item.href}`) ? styles.active : ""}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        {usernameLoaded && username && (
          <div className={styles.userMenu} ref={userMenuRef}>
            <button
              type="button"
              className={styles.usernameButton}
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {username}
            </button>
            <div
              className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ""}`}
            >
              <p className={styles.dropdownLabel}>Username: {username}</p>
              <button
                type="button"
                className={styles.changeButton}
                onClick={() => {
                  setChangeModalOpen(true);
                  setDropdownOpen(false);
                }}
              >
                Change
              </button>
            </div>
          </div>
        )}
      </div>
      <UsernameModal
        isOpen={(usernameLoaded && !username && pathname === "/washing") || changeModalOpen}
        dismissible={changeModalOpen}
        onClose={() => setChangeModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
