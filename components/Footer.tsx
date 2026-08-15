import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/text-logo.png"
                alt="Jaipur Startup"
                className={styles.brandLogoImg}
              />
            </Link>
            <p className={styles.tagline}>
              Discover startups, founders and ideas shaping Jaipur&rsquo;s next chapter.
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
          <p>© {new Date().getFullYear()} Jaipur Startup. All rights reserved.</p>
          <span className={styles.builtWith}>Building Jaipur&rsquo;s Startup Ecosystem</span>
        </div>
      </div>
    </footer>
  );
}
