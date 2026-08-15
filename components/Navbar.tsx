'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/text-logo.png"
            alt="Jaipur Startup"
            className={styles.brandLogoImg}
          />
        </Link>

        <nav className={styles.nav}>
          <Link
            href="/"
            className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
          >
            Map
          </Link>
          <Link
            href="/startups"
            className={`${styles.navLink} ${pathname === '/startups' ? styles.active : ''}`}
          >
            Startups
          </Link>
          <Link
            href="/my-startup"
            className={`${styles.navLink} ${pathname.startsWith('/my-startup') ? styles.active : ''}`}
          >
            Founder Area
          </Link>
          <Link
            href="/admin"
            className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}
          >
            Admin
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/add" className={styles.ctaButton} id="nav-list-startup-btn">
            List Your Startup
            <span className={styles.ctaArrow}>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
