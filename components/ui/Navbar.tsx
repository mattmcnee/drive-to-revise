"use client";

import React from "react";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import menuIcon from "@/public/icons/menu.svg";
import closeIcon from "@/public/icons/close.svg";
import driveIcon from "@/public/favicon.svg";
import Image from "next/image";

import { useAuth } from "@/firebase/useAuth";

const NavLinks = ({ className }: { className: string }) => {
  const { user, logout } = useAuth();

  const logoutUser = () => {
    logout();
  };

  return (
    <ul className={className}>
      <li><Link href="/">Home</Link></li>
            
      <li><Link href="/credits">Credits</Link></li>
      {user ? (
        <>
          <li><Link href="/mysets">My Sets</Link></li>
          <li><Link href="/profile">Profile</Link></li>
          <li><div onClick={logoutUser} className={styles.link}>Logout</div></li>
        </>
      ) : (
        <>
          <li><Link href="/login">Login</Link></li>
          <li><Link href="/signup">Sign Up</Link></li>
        </>
      )}
    </ul>
  );
};

const Navbar = () => {


  return (
    <div className={styles.navbarContainer}>
      <nav className={styles.navbar}>
        <Link href="/">
          <div className={styles.navLeft}>
            <Image src={driveIcon} alt="Drive To Revise" priority={true} />
            <span className={styles.navTitle}>Drive To Revise</span>
          </div>
        </Link>
        <NavLinks className={styles.navList}/>
        <div className={styles.dropdown}>
          <input type="checkbox" id="menuToggle" className={styles.menuToggle} />
          <label htmlFor="menuToggle" className={`${styles.dropbtn} no-select`}>
            <Image
              src={menuIcon}
              alt="Menu"
              className={styles.menuIcon}
              priority={true}
            />
            <Image
              src={closeIcon}
              alt="Close"
              className={styles.closeIcon}
              priority={true}
            />
          </label>
          <NavLinks className={styles.dropdownContent}/>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
