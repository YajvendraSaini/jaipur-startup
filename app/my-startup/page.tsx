'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Edit3,
  ExternalLink,
  LogOut,
  MapPin,
  Plus,
  Lock,
  Rocket,
  Clock,
  XCircle,
} from 'lucide-react';
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
          <Lock size={36} className={styles.lockIconLucide} />
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
    <>
      {/* Hero Header with Header.png matching site identity */}
      <section className={styles.heroHeader}>
        <div className={styles.bgImageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Header.png"
            alt="Jaipur Architecture Backdrop"
            className={styles.bgImage}
          />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroHeaderTop}>
            <div>
              <h1 className={styles.heroTitle}>Founder Dashboard</h1>
              <p className={styles.heroSubtitle}>
                Logged in as <strong>{user.name}</strong> ({user.email})
              </p>
            </div>

            <button onClick={logoutUser} className={styles.logoutBtn}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.container}>
          {submittedJustNow && (
            <div className={styles.successBanner}>
              <CheckCircle size={22} className={styles.bannerIconLucide} />
              <div>
                <h4>Startup Submitted Successfully!</h4>
                <p>
                  Your submission is now under admin review. Once approved, it will be published to the public map.
                </p>
              </div>
            </div>
          )}

          {myStartup ? (
            <div className={styles.startupCard}>
              <div className={styles.cardMain}>
                <div className={styles.logo}>{myStartup.logo}</div>
                <div className={styles.meta}>
                  <div className={styles.nameRow}>
                    <h2 className={styles.name}>{myStartup.name}</h2>
                    <span className={`${styles.statusBadge} ${styles[myStartup.status]}`}>
                      {myStartup.status === 'published' && <CheckCircle size={13} />}
                      {myStartup.status === 'pending' && <Clock size={13} />}
                      {myStartup.status === 'rejected' && <XCircle size={13} />}
                      Status: {myStartup.status}
                    </span>
                  </div>
                  <p className={styles.tagline}>&ldquo;{myStartup.tagline}&rdquo;</p>
                  <div className={styles.pills}>
                    <span>{myStartup.sector}</span>
                    <span>•</span>
                    <span>{myStartup.stage}</span>
                    <span>•</span>
                    <span>
                      <MapPin size={13} className={styles.inlineIcon} /> {myStartup.location}
                    </span>
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
                    View Public Profile <ExternalLink size={14} />
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
                  <Edit3 size={15} /> Edit Startup
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.noStartupCard}>
              <Rocket size={42} className={styles.emptyIconLucide} />
              <h3>You haven&rsquo;t listed a startup yet</h3>
              <p>Get your company discovered by investors, talent, and customers on Jaipur&rsquo;s official map.</p>
              <Link href="/add" className={styles.addBtn} id="dashboard-add-startup-btn">
                <Plus size={16} /> Add Your Startup Now
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
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
