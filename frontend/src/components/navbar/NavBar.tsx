"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";

const navItems = [{ name: "home" }, { name: "about" }, { name: "washing" }];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

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
      <ul className={`${styles.navlist} ${menuOpen ? styles.open : ""}`}>
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={`/${item.name}`}
              className={isActive(`/${item.name}`) ? styles.active : ""}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
