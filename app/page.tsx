'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStartupsStore } from '@/lib/store';
import { Startup, SECTORS, STAGES } from '@/lib/data';
import styles from './page.module.css';

// Dynamic import for Leaflet map (client side only)
const StartupMap = dynamic(() => import('@/components/StartupMap'), {
  ssr: false,
  loading: () => (
    <div className={styles.mapLoading}>
      <div className={styles.spinner}></div>
      <p>Loading Jaipur Startup Map...</p>
    </div>
  ),
});

export default function Home() {
  const { publishedStartups, isLoaded } = useStartupsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [selectedStage, setSelectedStage] = useState<string>('All Stage');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  // Filter startups based on search and filters
  const filteredStartups = useMemo(() => {
    return publishedStartups.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sector.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        selectedSector === 'All Sectors' || s.sector === selectedSector;
      const matchesStage =
        selectedStage === 'All Stage' || s.stage === selectedStage;

      return matchesSearch && matchesSector && matchesStage;
    });
  }, [publishedStartups, searchQuery, selectedSector, selectedStage]);

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      {/* ── Hero Banner Section matching Header.png & Map UI.png ── */}
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
          <h1 className={styles.heroTitle}>
            Discover what Jaipur is Building.
          </h1>
          <p className={styles.heroSubtitle}>
            Explore startups, founders and ideas shaping Jaipur&rsquo;s next chapter.
          </p>

          {/* Floating Search & Filter Bar (Shadcn UI style from Map UI.png) */}
          <div className={styles.searchFilterCard}>
            <div className={styles.searchInputBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Type a startup name or search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                id="hero-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={styles.clearSearchBtn}
                >
                  ✕
                </button>
              )}
            </div>

            <div className={styles.selectDivider}></div>

            {/* Stage Dropdown */}
            <div className={styles.selectBox}>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className={styles.selectInput}
                id="hero-stage-select"
              >
                <option value="All Stage">All Stage</option>
                {STAGES.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>
              <span className={styles.dropdownChevron}>⌄</span>
            </div>

            <div className={styles.selectDivider}></div>

            {/* Sector Dropdown */}
            <div className={styles.selectBox}>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className={styles.selectInput}
                id="hero-sector-select"
              >
                <option value="All Sectors">All Sectors</option>
                {SECTORS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
              <span className={styles.dropdownChevron}>⌄</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Map & Discovery Section matching Map UI.png ── */}
      <main className={styles.mapSection} id="startup-map">
        <div className={styles.container}>
          {/* Section Heading */}
          <h2 className={styles.mapHeading}>Startup Map</h2>

          <div className={styles.mapLayoutGrid}>
            {/* Left Column: Leaflet Map Canvas */}
            <div className={styles.mapColumn}>
              {isLoaded && (
                <StartupMap
                  startups={filteredStartups}
                  selectedStartup={selectedStartup}
                  onSelectStartup={(startup) => setSelectedStartup(startup)}
                />
              )}
            </div>

            {/* Right Column: Interactive Sidebar Panel matching Map UI.png */}
            <aside className={styles.sidebarColumn}>
              {/* Selected Startup Detail Panel when pin clicked on map */}
              {selectedStartup ? (
                <div className={styles.selectedDetailPanel}>
                  <div className={styles.detailHeader}>
                    <div className={styles.detailHeaderTitle}>
                      <span className={styles.detailLogo}>{selectedStartup.logo}</span>
                      <div>
                        <h3 className={styles.detailName}>{selectedStartup.name}</h3>
                        <div className={styles.detailPills}>
                          <span className={styles.pSector}>{selectedStartup.sector}</span>
                          <span className={styles.pStage}>{selectedStartup.stage}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStartup(null)}
                      className={styles.closeDetailBtn}
                      title="Close details view"
                    >
                      ✕
                    </button>
                  </div>

                  <p className={styles.detailTagline}>&ldquo;{selectedStartup.tagline}&rdquo;</p>
                  <p className={styles.detailDesc}>{selectedStartup.description}</p>

                  <div className={styles.detailMetaRow}>
                    <span>📍 {selectedStartup.location}</span>
                    <span>👥 {selectedStartup.teamSize} Employees</span>
                  </div>

                  {selectedStartup.founders && selectedStartup.founders.length > 0 && (
                    <div className={styles.detailFoundersRow}>
                      <span className={styles.detailFoundersLabel}>Founders:</span>{' '}
                      {selectedStartup.founders.map((f) => f.name).join(', ')}
                    </div>
                  )}

                  <div className={styles.detailActionsRow}>
                    <Link
                      href={`/startup/${selectedStartup.slug}`}
                      className={styles.primaryDetailBtn}
                    >
                      View Full Profile →
                    </Link>

                    {selectedStartup.website && (
                      <a
                        href={selectedStartup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondaryDetailBtn}
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Startup Cards Stack List */}
              <div className={styles.cardsStack}>
                {filteredStartups.map((startup) => {
                  const isSelected = selectedStartup?.id === startup.id;
                  return (
                    <div
                      key={startup.id}
                      className={`${styles.startupCard} ${
                        isSelected ? styles.activeCard : ''
                      }`}
                      onClick={() => setSelectedStartup(startup)}
                    >
                      <div className={styles.cardHeaderRow}>
                        <div className={styles.logoBox}>
                          <span className={styles.logoText}>{startup.logo}</span>
                        </div>
                        <div className={styles.cardMeta}>
                          <h3 className={styles.startupName}>{startup.name}</h3>
                          <p className={styles.startupDesc}>
                            {startup.tagline ||
                              'A vertically stacked set of interactive headings that reveal associated content.'}
                          </p>
                        </div>
                      </div>

                      <div className={styles.cardActionsRow}>
                        {startup.website ? (
                          <a
                            href={startup.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionBtn}
                            onClick={(e) => e.stopPropagation()}
                          >
                            🌐 View Website
                          </a>
                        ) : (
                          <span className={styles.actionBtnDisabled}>
                            🌐 View Website
                          </span>
                        )}

                        <button
                          type="button"
                          className={styles.actionBtnSecondary}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStartup(startup);
                          }}
                        >
                          🔍 Quick Scan
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredStartups.length === 0 && (
                  <div className={styles.noResultsCard}>
                    <p>No startups match your search criteria.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSector('All Sectors');
                        setSelectedStage('All Stage');
                      }}
                      className={styles.resetFiltersBtn}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Right CTA matching Map UI.png */}
              <Link href="/add" className={styles.addFreeCtaBtn} id="add-free-cta-btn">
                <span className={styles.ctaPinIcon}>📍</span> Add your startup for free!
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
