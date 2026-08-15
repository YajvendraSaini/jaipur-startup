'use client';

import { use } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Globe,
  MapPin,
  ExternalLink,
  Users,
  Calendar,
  Building,
  Map as MapIcon,
  Share2,
  AtSign,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStartupsStore } from '@/lib/store';
import styles from './page.module.css';

// Dynamic import for Leaflet map component
const StartupMap = dynamic(() => import('@/components/StartupMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '300px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
      Loading map location...
    </div>
  ),
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function StartupProfilePage({ params }: PageProps) {
  const { slug } = use(params);
  const { startups, isLoaded } = useStartupsStore();

  const startup = startups.find((s) => s.slug === slug || s.id === slug);

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <Navbar />
        <div className={styles.loader}>Loading startup profile...</div>
        <Footer />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className={styles.notFoundContainer}>
        <Navbar />
        <div className={styles.notFoundContent}>
          <h2>Startup Not Found</h2>
          <p>The startup profile you are looking for does not exist or has not been published yet.</p>
          <Link href="/startups" className={styles.backBtn}>
            <ArrowLeft size={16} /> Browse Jaipur Startups
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />

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
          <Link href="/startups" className={styles.backLink}>
            <ArrowLeft size={15} /> Back to Jaipur Directory
          </Link>

          <div className={styles.profileHeaderCard}>
            <div className={styles.logoBadge}>{startup.logo}</div>
            
            <div className={styles.headerInfo}>
              <div className={styles.titleRow}>
                <h1 className={styles.startupName}>{startup.name}</h1>
                <span className={`${styles.statusBadge} ${styles[startup.status]}`}>
                  {startup.status}
                </span>
              </div>

              <p className={styles.tagline}>&ldquo;{startup.tagline}&rdquo;</p>

              <div className={styles.pillsRow}>
                <span className={styles.sectorPill}>{startup.sector}</span>
                <span className={styles.stagePill}>{startup.stage}</span>
                <span className={styles.locationPill}>
                  <MapPin size={13} className={styles.inlineIcon} /> {startup.location}
                </span>
              </div>
            </div>

            <div className={styles.headerCtaBox}>
              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryCta}
                  id="profile-website-cta"
                >
                  <Globe size={15} /> Visit Website <ExternalLink size={13} />
                </a>
              )}
              <Link href="/" className={styles.secondaryCta}>
                <MapIcon size={15} /> View on Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.profileGrid}>
            {/* Main Column */}
            <div className={styles.leftCol}>
              {/* About Section */}
              <section className={styles.cardSection}>
                <h2 className={styles.sectionTitle}>About {startup.name}</h2>
                <p className={styles.descriptionParagraph}>{startup.description}</p>
              </section>

              {/* Founders Section */}
              <section className={styles.cardSection}>
                <h2 className={styles.sectionTitle}>Founding Team</h2>
                <div className={styles.foundersGrid}>
                  {startup.founders.map((f, idx) => (
                    <div key={idx} className={styles.founderCard}>
                      <div className={styles.founderAvatar}>
                        {f.name.charAt(0)}
                      </div>
                      <div className={styles.founderMeta}>
                        <h4 className={styles.founderName}>{f.name}</h4>
                        <span className={styles.founderRole}>{f.role}</span>
                        {f.linkedin && (
                          <a
                            href={f.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.founderLinkedin}
                          >
                            <ExternalLink size={12} /> Profile
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Map Location Section */}
              <section className={styles.cardSection}>
                <h2 className={styles.sectionTitle}>Jaipur HQ Location</h2>
                <p className={styles.locationSubtext}>
                  Located in <strong>{startup.location}</strong>. Latitude: {startup.latitude}, Longitude: {startup.longitude}
                </p>
                <div className={styles.mapContainerBox}>
                  <StartupMap
                    startups={[startup]}
                    selectedStartup={startup}
                    onSelectStartup={() => {}}
                  />
                </div>
              </section>
            </div>

            {/* Sidebar Details */}
            <aside className={styles.rightCol}>
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>Company Overview</h3>

                <div className={styles.overviewList}>
                  <div className={styles.overviewItem}>
                    <span className={styles.itemLabel}>
                      <Building size={14} className={styles.inlineIcon} /> Sector
                    </span>
                    <span className={styles.itemValue}>{startup.sector}</span>
                  </div>

                  <div className={styles.overviewItem}>
                    <span className={styles.itemLabel}>Funding Stage</span>
                    <span className={styles.itemValue}>{startup.stage}</span>
                  </div>

                  <div className={styles.overviewItem}>
                    <span className={styles.itemLabel}>
                      <Calendar size={14} className={styles.inlineIcon} /> Founded
                    </span>
                    <span className={styles.itemValue}>{startup.foundedYear}</span>
                  </div>

                  <div className={styles.overviewItem}>
                    <span className={styles.itemLabel}>
                      <Users size={14} className={styles.inlineIcon} /> Team Size
                    </span>
                    <span className={styles.itemValue}>{startup.teamSize} Employees</span>
                  </div>

                  <div className={styles.overviewItem}>
                    <span className={styles.itemLabel}>
                      <MapPin size={14} className={styles.inlineIcon} /> Headquarters
                    </span>
                    <span className={styles.itemValue}>{startup.location}</span>
                  </div>
                </div>

                <h4 className={styles.socialsHeader}>Online Presence</h4>
                <div className={styles.socialsList}>
                  {startup.website && (
                    <a href={startup.website} target="_blank" rel="noreferrer" className={styles.socialLink}>
                      <Globe size={14} /> Website
                    </a>
                  )}
                  {startup.linkedin && (
                    <a href={startup.linkedin} target="_blank" rel="noreferrer" className={styles.socialLink}>
                      <Share2 size={14} /> LinkedIn
                    </a>
                  )}
                  {startup.instagram && (
                    <a href={startup.instagram} target="_blank" rel="noreferrer" className={styles.socialLink}>
                      <AtSign size={14} /> Instagram
                    </a>
                  )}
                  {startup.twitter && (
                    <a href={startup.twitter} target="_blank" rel="noreferrer" className={styles.socialLink}>
                      <Share2 size={14} /> Twitter / X
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.shareCard}>
                <h4>Building from Jaipur?</h4>
                <p>Are you part of this startup? Keep your details and map location updated.</p>
                <Link href="/my-startup" className={styles.editBtn}>
                  Founder Login / Manage
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
