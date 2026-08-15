'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStartupsStore } from '@/lib/store';
import { SECTORS, STAGES } from '@/lib/data';
import styles from './page.module.css';

export default function StartupsDirectory() {
  const { publishedStartups, isLoaded } = useStartupsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

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

      <main className={styles.main}>
        <div className={styles.headerSection}>
          <div className={styles.container}>
            <span className={styles.headerBadge}>Public Ecosystem Directory</span>
            <h1 className={styles.title}>JAIPUR STARTUPS</h1>
            <p className={styles.subtitle}>
              Explore the innovative companies, high-growth tech ventures, and ambitious founders building from Jaipur.
            </p>
          </div>
        </div>

        <div className={styles.container}>
          {/* Search & Filter Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by company, tech stack, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                id="directory-search-input"
              />
            </div>

            <div className={styles.filterGroup}>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className={styles.select}
                id="directory-sector-select"
              >
                <option value="All">All Sectors</option>
                {SECTORS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>

              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className={styles.select}
                id="directory-stage-select"
              >
                <option value="All">All Stages</option>
                {STAGES.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>

              {/* Grid / List Layout Switcher */}
              <div className={styles.layoutSwitcher}>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`${styles.switchBtn} ${layoutMode === 'grid' ? styles.activeSwitch : ''}`}
                  title="Grid View"
                  id="grid-layout-btn"
                >
                  ▦ Grid
                </button>
                <button
                  onClick={() => setLayoutMode('list')}
                  className={`${styles.switchBtn} ${layoutMode === 'list' ? styles.activeSwitch : ''}`}
                  title="List View"
                  id="list-layout-btn"
                >
                  ≡ List
                </button>
              </div>
            </div>
          </div>

          <div className={styles.resultsSummary}>
            <span>Showing <strong>{filteredStartups.length}</strong> startups</span>
            <Link href="/" className={styles.mapViewLink}>
              🗺️ View on Public Map →
            </Link>
          </div>

          {/* Directory Content */}
          {filteredStartups.length > 0 ? (
            <div
              className={
                layoutMode === 'grid' ? styles.gridContainer : styles.listContainer
              }
            >
              {filteredStartups.map((startup) => (
                <div
                  key={startup.id}
                  className={
                    layoutMode === 'grid' ? styles.gridCard : styles.listCard
                  }
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.logo}>{startup.logo}</div>
                    <div className={styles.headerTitles}>
                      <h3 className={styles.name}>{startup.name}</h3>
                      <div className={styles.badgeRow}>
                        <span className={styles.sectorBadge}>{startup.sector}</span>
                        <span className={styles.stageBadge}>{startup.stage}</span>
                      </div>
                    </div>
                  </div>

                  <p className={styles.description}>{startup.description}</p>

                  <div className={styles.cardFooter}>
                    <span className={styles.location}>📍 {startup.location}</span>
                    <Link
                      href={`/startup/${startup.slug}`}
                      className={styles.viewBtn}
                      id={`directory-view-${startup.slug}`}
                    >
                      View Startup →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>No startups found</h3>
              <p>Try clearing filters or search query to explore Jaipur companies.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSector('All');
                  setSelectedStage('All');
                }}
                className={styles.resetBtn}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
