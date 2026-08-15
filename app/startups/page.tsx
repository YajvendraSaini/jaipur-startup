'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  Grid,
  List,
  MapPin,
  ArrowRight,
  Globe,
  X,
  Map as MapIcon,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStartupsStore } from '@/lib/store';
import { SECTORS, STAGES } from '@/lib/data';
import styles from './page.module.css';

export default function StartupsDirectory() {
  const { publishedStartups } = useStartupsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

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
        selectedStage === 'All Stages' || s.stage === selectedStage;

      return matchesSearch && matchesSector && matchesStage;
    });
  }, [publishedStartups, searchQuery, selectedSector, selectedStage]);

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      {/* Hero Header with Header.png matching Homepage */}
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
          <h1 className={styles.heroTitle}>Jaipur Startups</h1>
          <p className={styles.heroSubtitle}>
            Explore the innovative companies, high-growth tech ventures, and ambitious founders building from Jaipur.
          </p>

          {/* Floating Toolbar inside Hero */}
          <div className={styles.searchFilterCard}>
            <div className={styles.searchInputBox}>
              <Search size={18} className={styles.searchIconLucide} />
              <input
                type="text"
                placeholder="Search by company, tech stack, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                id="directory-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={styles.clearSearchBtn}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className={styles.selectDivider}></div>

            <div className={styles.selectBox}>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className={styles.selectInput}
                id="directory-stage-select"
              >
                <option value="All Stages">All Stages</option>
                {STAGES.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className={styles.dropdownChevronLucide} />
            </div>

            <div className={styles.selectDivider}></div>

            <div className={styles.selectBox}>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className={styles.selectInput}
                id="directory-sector-select"
              >
                <option value="All Sectors">All Sectors</option>
                {SECTORS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className={styles.dropdownChevronLucide} />
            </div>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.resultsSummary}>
            <span>
              Showing <strong>{filteredStartups.length}</strong> startups
            </span>

            <div className={styles.summaryRight}>
              {/* Grid / List Layout Switcher */}
              <div className={styles.layoutSwitcher}>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`${styles.switchBtn} ${
                    layoutMode === 'grid' ? styles.activeSwitch : ''
                  }`}
                  title="Grid View"
                  id="grid-layout-btn"
                >
                  <Grid size={15} /> Grid
                </button>
                <button
                  onClick={() => setLayoutMode('list')}
                  className={`${styles.switchBtn} ${
                    layoutMode === 'list' ? styles.activeSwitch : ''
                  }`}
                  title="List View"
                  id="list-layout-btn"
                >
                  <List size={15} /> List
                </button>
              </div>

              <Link href="/" className={styles.mapViewLink}>
                <MapIcon size={15} /> View on Public Map →
              </Link>
            </div>
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
                    <span className={styles.location}>
                      <MapPin size={14} className={styles.inlineIcon} /> {startup.location}
                    </span>

                    <div className={styles.footerActions}>
                      {startup.website && (
                        <a
                          href={startup.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.websiteBtn}
                        >
                          <Globe size={13} />
                        </a>
                      )}
                      <Link
                        href={`/startup/${startup.slug}`}
                        className={styles.viewBtn}
                        id={`directory-view-${startup.slug}`}
                      >
                        View Profile <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyContainer}>
              <Search size={36} className={styles.emptyIconLucide} />
              <h3>No startups found</h3>
              <p>Try clearing filters or search query to explore Jaipur companies.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSector('All Sectors');
                  setSelectedStage('All Stages');
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
