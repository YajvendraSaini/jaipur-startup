'use client';

import { useState } from 'react';
import Link from 'next/link';
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

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <span className={styles.adminBadge}>Admin Review Portal</span>
              <h1 className={styles.title}>Ecosystem Submissions</h1>
              <p className={styles.subtitle}>
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

          {/* Navigation Tabs */}
          <div className={styles.tabsRow}>
            <button
              onClick={() => setActiveTab('pending')}
              className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.activeTab : ''}`}
            >
              ⏳ Pending ({pendingList.length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`${styles.tabBtn} ${activeTab === 'published' ? styles.activeTab : ''}`}
            >
              ✅ Published ({publishedList.length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`${styles.tabBtn} ${activeTab === 'rejected' ? styles.activeTab : ''}`}
            >
              ❌ Rejected ({rejectedList.length})
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
                    <p className={styles.location}>📍 {startup.location}</p>

                    <div className={styles.itemActions}>
                      <button
                        onClick={() => setSelectedReviewStartup(startup)}
                        className={styles.reviewBtn}
                        id={`review-startup-${startup.slug}`}
                      >
                        🔍 Review Details
                      </button>

                      {startup.status !== 'published' && (
                        <button
                          onClick={() => updateStatus(startup.id, 'published')}
                          className={styles.approveBtn}
                          id={`approve-startup-${startup.slug}`}
                        >
                          ✓ Approve
                        </button>
                      )}

                      {startup.status !== 'rejected' && (
                        <button
                          onClick={() => updateStatus(startup.id, 'rejected')}
                          className={styles.rejectBtn}
                        >
                          ✕ Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyCard}>
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
                    ✕
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
                        {selectedReviewStartup.website} ↗
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
                    ✓ Approve & Publish to Map
                  </button>

                  <button
                    onClick={() => {
                      updateStatus(selectedReviewStartup.id, 'rejected');
                      setSelectedReviewStartup(null);
                    }}
                    className={styles.rejectBtn}
                  >
                    ✕ Reject Submission
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
