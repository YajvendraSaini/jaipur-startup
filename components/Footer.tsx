import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand}>
              <span className={styles.brandTop}>JAIPUR</span>
              <span className={styles.brandBottom}>STARTUP</span>
            </Link>
            <p className={styles.tagline}>
              The public map and ecosystem directory for founders building from the Pink City of India.
            </p>
          </div>

          <div className={styles.linksCol}>
            <h4>Discovery</h4>
            <Link href="/">Startup Map</Link>
            <Link href="/startups">Directory</Link>
          </div>

          <div className={styles.linksCol}>
            <h4>Founders</h4>
            <Link href="/add">List Your Startup</Link>
            <Link href="/my-startup">Manage Profile</Link>
            <Link href="/login">Login</Link>
          </div>

          <div className={styles.linksCol}>
            <h4>Platform</h4>
            <Link href="/admin">Admin Review</Link>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter / X</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Jaipur Startup. Built for the Jaipur tech ecosystem.</p>
          <span className={styles.builtWith}>Built with 💖 in Jaipur, Rajasthan</span>
        </div>
      </div>
    </footer>
  );
}
