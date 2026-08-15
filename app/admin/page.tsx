'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStartupsStore } from '@/lib/store';
import { Startup } from '@/lib/data';
import styles from './page.module.css';

export default function AdminPage() {
  const { startups, updateStatus, isLoaded } = useStartupsStore();

  const [activeTab, setActiveTab] = useState<'pending' | 'published' | 'rejected'>('pending');
  const [selectedReviewStartup, setSelectedReviewStartup] = useState<Startup | null>(null);

  const pendingList = startups.filter((s) => s.status === 'pending');
  const publishedList = startups.filter((s) => s.status === 'published');
  const rejectedList = startups.filter((s) => s.status === 'rejected');

  const currentList =
    activeTab === 'pending'
      ? pendingList
      : activeTab === 'published'
      ? publishedList
      : rejectedList;

  if (!isLoaded) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <div className={styles.loader}>Loading admin panel...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      {/* Hero Header matching site identity */}
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
              <h1 className={styles.heroTitle}>Ecosystem Admin</h1>
              <p className={styles.heroSubtitle}>
                Review founder submissions, verify location & quality, approve for public map activation.
              </p>
            </div>

            <div className={styles.statsSummary}>
              <div className={styles.statBox}>
                <span className={styles.num}>{pendingList.length}</span>
                <span className={styles.lbl}>Pending Review</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.num}>{publishedList.length}</span>
                <span className={styles.lbl}>Live Published</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Navigation Tabs */}
          <div className={styles.tabsRow}>
            <button
              onClick={() => setActiveTab('pending')}
              className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.activeTab : ''}`}
            >
              <Clock size={15} /> Pending ({pendingList.length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`${styles.tabBtn} ${activeTab === 'published' ? styles.activeTab : ''}`}
            >
              <CheckCircle size={15} /> Published ({publishedList.length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`${styles.tabBtn} ${activeTab === 'rejected' ? styles.activeTab : ''}`}
            >
              <XCircle size={15} /> Rejected ({rejectedList.length})
            </button>
          </div>

          {/* Submissions List */}
          <div className={styles.listSection}>
            {currentList.length > 0 ? (
              <div className={styles.itemsGrid}>
                {currentList.map((startup) => (
                  <div key={startup.id} className={styles.itemCard}>
                    <div className={styles.itemHeader}>
                      <div className={styles.logo}>{startup.logo}</div>
                      <div className={styles.itemTitleGroup}>
                        <h3 className={styles.name}>{startup.name}</h3>
                        <span className={styles.pills}>
                          {startup.sector} · {startup.stage}
                        </span>
                      </div>
                      <span className={`${styles.statusBadge} ${styles[startup.status]}`}>
                        {startup.status}
                      </span>
                    </div>

                    <p className={styles.tagline}>&ldquo;{startup.tagline}&rdquo;</p>
                    <p className={styles.location}>
                      <MapPin size={13} className={styles.inlineIcon} /> {startup.location}
                    </p>

                    <div className={styles.itemActions}>
                      <button
                        onClick={() => setSelectedReviewStartup(startup)}
                        className={styles.reviewBtn}
                        id={`review-startup-${startup.slug}`}
                      >
                        <Search size={14} /> Review Details
                      </button>

                      {startup.status !== 'published' && (
                        <button
                          onClick={() => updateStatus(startup.id, 'published')}
                          className={styles.approveBtn}
                          id={`approve-startup-${startup.slug}`}
                        >
                          <Check size={14} /> Approve
                        </button>
                      )}

                      {startup.status !== 'rejected' && (
                        <button
                          onClick={() => updateStatus(startup.id, 'rejected')}
                          className={styles.rejectBtn}
                        >
                          <X size={14} /> Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyCard}>
                <Shield size={36} className={styles.emptyIconLucide} />
                <p>No startups currently in {activeTab} queue.</p>
              </div>
            )}
          </div>

          {/* Review Modal Dialog */}
          {selectedReviewStartup && (
            <div className={styles.modalOverlay} onClick={() => setSelectedReviewStartup(null)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleRow}>
                    <span className={styles.modalLogo}>{selectedReviewStartup.logo}</span>
                    <div>
                      <h2>{selectedReviewStartup.name}</h2>
                      <p>{selectedReviewStartup.sector} · {selectedReviewStartup.stage}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReviewStartup(null)}
                    className={styles.closeModalBtn}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <h4>Tagline</h4>
                  <p>&ldquo;{selectedReviewStartup.tagline}&rdquo;</p>

                  <h4>Description</h4>
                  <p>{selectedReviewStartup.description}</p>

                  <div className={styles.metaRow}>
                    <div>
                      <strong>Location:</strong> {selectedReviewStartup.location}
                    </div>
                    <div>
                      <strong>Coordinates:</strong> {selectedReviewStartup.latitude}, {selectedReviewStartup.longitude}
                    </div>
                    <div>
                      <strong>Founded:</strong> {selectedReviewStartup.foundedYear}
                    </div>
                    <div>
                      <strong>Team:</strong> {selectedReviewStartup.teamSize}
                    </div>
                  </div>

                  {selectedReviewStartup.website && (
                    <p>
                      <strong>Website:</strong>{' '}
                      <a href={selectedReviewStartup.website} target="_blank" rel="noreferrer">
                        {selectedReviewStartup.website} <ExternalLink size={13} style={{ display: 'inline' }} />
                      </a>
                    </p>
                  )}
                </div>

                <div className={styles.modalFooter}>
                  <button
                    onClick={() => {
                      updateStatus(selectedReviewStartup.id, 'published');
                      setSelectedReviewStartup(null);
                    }}
                    className={styles.approveBtn}
                  >
                    <Check size={16} /> Approve & Publish to Map
                  </button>

                  <button
                    onClick={() => {
                      updateStatus(selectedReviewStartup.id, 'rejected');
                      setSelectedReviewStartup(null);
                    }}
                    className={styles.rejectBtn}
                  >
                    <X size={16} /> Reject Submission
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
