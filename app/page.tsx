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
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
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

      const matchesSector = selectedSector === 'All' || s.sector === selectedSector;
      const matchesStage = selectedStage === 'All' || s.stage === selectedStage;

      return matchesSearch && matchesSector && matchesStage;
    });
  }, [publishedStartups, searchQuery, selectedSector, selectedStage]);

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      {/* ── Visual Banner Hero with Jaipur Heritage Backdrop ── */}
      <section className={styles.heroHeader}>
        <div className={styles.bgImageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/BG.png"
            alt="Hawa Mahal Jaipur Backdrop"
            className={styles.bgImage}
          />
          <div className={styles.bgOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            Jaipur Ecosystem Directory & Map
          </div>
          <h1 className={styles.title}>
            Discover what&rsquo;s being built in <span className={styles.highlight}>Jaipur.</span>
          </h1>
          <p className={styles.subtitle}>
            Explore the pink city&rsquo;s most ambitious founders, high-growth startups, and innovative tech companies mapped in real time.
          </p>

          {/* Quick Stats Bar */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{publishedStartups.length}</span>
              <span className={styles.statLabel}>Mapped Startups</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10+</span>
              <span className={styles.statLabel}>Tech Hubs</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>₹500Cr+</span>
              <span className={styles.statLabel}>Combined Capital</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN PRODUCT: Interactive Discovery Section (Map + Cards) ── */}
      <main className={styles.discoverySection} id="map-section">
        <div className={styles.container}>
          {/* Control Bar: Search & Filters */}
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search startups, sectors, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                id="map-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={styles.clearBtn}
                >
                  ✕
                </button>
              )}
            </div>

            <div className={styles.filtersGroup}>
              {/* Sector Filter */}
              <div className={styles.selectWrapper}>
                <label className={styles.selectLabel}>Sector:</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className={styles.select}
                  id="sector-filter-select"
                >
                  <option value="All">All Sectors ({publishedStartups.length})</option>
                  {SECTORS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stage Filter */}
              <div className={styles.selectWrapper}>
                <label className={styles.selectLabel}>Stage:</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className={styles.select}
                  id="stage-filter-select"
                >
                  <option value="All">All Stages</option>
                  {STAGES.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>

              {(selectedSector !== 'All' || selectedStage !== 'All' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setSelectedSector('All');
                    setSelectedStage('All');
                    setSearchQuery('');
                  }}
                  className={styles.resetFiltersBtn}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Map Layout Grid: Map on Left/Main, Selected Startup Detail Card / Active List on Right */}
          <div className={styles.mapGrid}>
            <div className={styles.mapColumn}>
              {isLoaded && (
                <StartupMap
                  startups={filteredStartups}
                  selectedStartup={selectedStartup}
                  onSelectStartup={(startup) => setSelectedStartup(startup)}
                />
              )}
              <div className={styles.mapLegend}>
                <span className={styles.legendTitle}>Click markers to inspect startup</span>
                <span className={styles.legendCount}>
                  Showing <strong>{filteredStartups.length}</strong> of {publishedStartups.length} startups
                </span>
              </div>
            </div>

            {/* Sidebar Preview Card or Selected Startup Details */}
            <aside className={styles.sidebarColumn}>
              {selectedStartup ? (
                <div className={`${styles.previewCard} animate-slide-up`}>
                  <button
                    onClick={() => setSelectedStartup(null)}
                    className={styles.closeCardBtn}
                    title="Deselect"
                  >
                    ✕
                  </button>

                  <div className={styles.previewLogoBadge}>{selectedStartup.logo}</div>
                  <h3 className={styles.previewName}>{selectedStartup.name}</h3>
                  <div className={styles.previewMeta}>
                    <span className={styles.previewSector}>{selectedStartup.sector}</span>
                    <span className={styles.metaDot}>•</span>
                    <span className={styles.previewStage}>{selectedStartup.stage}</span>
                  </div>

                  <p className={styles.previewTagline}>&ldquo;{selectedStartup.tagline}&rdquo;</p>
                  <p className={styles.previewDesc}>{selectedStartup.description}</p>

                  <div className={styles.previewInfoList}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoIcon}>📍</span>
                      <span>{selectedStartup.location}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoIcon}>👥</span>
                      <span>{selectedStartup.teamSize} Team Members</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoIcon}>🗓️</span>
                      <span>Founded in {selectedStartup.foundedYear}</span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <Link
                      href={`/startup/${selectedStartup.slug}`}
                      className={styles.primaryCardBtn}
                      id={`view-profile-${selectedStartup.slug}`}
                    >
                      View Full Profile →
                    </Link>
                    {selectedStartup.website && (
                      <a
                        href={selectedStartup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondaryCardBtn}
                      >
                        Website ↗
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles.sidebarList}>
                  <div className={styles.sidebarListHeader}>
                    <h3>Mapped Companies ({filteredStartups.length})</h3>
                    <p>Select any pin on the map or click a card below</p>
                  </div>

                  <div className={styles.scrollList}>
                    {filteredStartups.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedStartup(s)}
                        className={styles.miniCard}
                      >
                        <div className={styles.miniLogo}>{s.logo}</div>
                        <div className={styles.miniDetails}>
                          <h4 className={styles.miniName}>{s.name}</h4>
                          <span className={styles.miniTag}>
                            {s.sector} · {s.location.split(',')[0]}
                          </span>
                        </div>
                        <span className={styles.miniArrow}>→</span>
                      </div>
                    ))}

                    {filteredStartups.length === 0 && (
                      <div className={styles.emptyState}>
                        <p>No startups match your search filters.</p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedSector('All');
                            setSelectedStage('All');
                          }}
                          className={styles.resetBtn}
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={styles.addCtaBanner}>
                    <h4>Building in Jaipur?</h4>
                    <p>Get your company featured on the official Jaipur Startup map.</p>
                    <Link href="/add" className={styles.bannerBtn} id="map-add-startup-cta">
                      + Add Your Startup
                    </Link>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
