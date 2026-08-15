'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStartupsStore } from '@/lib/store';
import styles from './page.module.css';

function DashboardContent() {
  const searchParams = useSearchParams();
  const submittedJustNow = searchParams.get('submitted') === 'true';

  const { user, startups, isLoaded, logoutUser } = useStartupsStore();

  const myStartup = user
    ? startups.find((s) => s.ownerId === user.id) || startups[0]
    : null;

  if (!isLoaded) {
    return <div className={styles.loader}>Loading dashboard...</div>;
  }

  if (!user) {
    return (
      <main className={styles.authNoticeMain}>
        <div className={styles.authNoticeCard}>
          <span className={styles.icon}>🗝️</span>
          <h2>Founder Login Required</h2>
          <p>Please log in to manage your Jaipur startup listing.</p>
          <Link href="/login?redirect=/my-startup" className={styles.loginBtn}>
            Log In to Dashboard →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {submittedJustNow && (
          <div className={styles.successBanner}>
            <span className={styles.bannerIcon}>🎉</span>
            <div>
              <h4>Startup Submitted Successfully!</h4>
              <p>
                Your submission is now under admin review. Once approved, it will be published to the public map.
              </p>
            </div>
          </div>
        )}

        <div className={styles.headerRow}>
          <div>
            <span className={styles.badge}>Founder Dashboard</span>
            <h1 className={styles.title}>MY STARTUP</h1>
            <p className={styles.subtitle}>
              Logged in as <strong>{user.name}</strong> ({user.email})
            </p>
          </div>

          <button onClick={logoutUser} className={styles.logoutBtn}>
            Sign Out
          </button>
        </div>

        {myStartup ? (
          <div className={styles.startupCard}>
            <div className={styles.cardMain}>
              <div className={styles.logo}>{myStartup.logo}</div>
              <div className={styles.meta}>
                <div className={styles.nameRow}>
                  <h2 className={styles.name}>{myStartup.name}</h2>
                  <span className={`${styles.statusBadge} ${styles[myStartup.status]}`}>
                    Status: {myStartup.status}
                  </span>
                </div>
                <p className={styles.tagline}>&ldquo;{myStartup.tagline}&rdquo;</p>
                <div className={styles.pills}>
                  <span>{myStartup.sector}</span>
                  <span>•</span>
                  <span>{myStartup.stage}</span>
                  <span>•</span>
                  <span>📍 {myStartup.location}</span>
                </div>
              </div>
            </div>

            <div className={styles.actionsRow}>
              {myStartup.status === 'published' ? (
                <Link
                  href={`/startup/${myStartup.slug}`}
                  className={styles.viewProfileBtn}
                  id="my-startup-view-profile"
                >
                  View Public Profile →
                </Link>
              ) : (
                <div className={styles.statusNote}>
                  {myStartup.status === 'pending' &&
                    '⏳ Pending approval from admin. Map placement will activate upon approval.'}
                  {myStartup.status === 'rejected' &&
                    '❌ Submission was rejected. Please edit and re-submit.'}
                </div>
              )}

              <Link
                href="/my-startup/edit"
                className={styles.editBtn}
                id="my-startup-edit-btn"
              >
                ✏️ Edit Startup
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.noStartupCard}>
            <div className={styles.emptyIcon}>🚀</div>
            <h3>You haven&rsquo;t listed a startup yet</h3>
            <p>Get your company discovered by investors, talent, and customers on Jaipur&rsquo;s official map.</p>
            <Link href="/add" className={styles.addBtn} id="dashboard-add-startup-btn">
              + Add Your Startup Now
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function MyStartupDashboard() {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Suspense fallback={<div className={styles.loader}>Loading...</div>}>
        <DashboardContent />
      </Suspense>
      <Footer />
    </div>
  );
}
