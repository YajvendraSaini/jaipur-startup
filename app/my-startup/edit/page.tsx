'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, ExternalLink, CheckCircle, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStartupsStore } from '@/lib/store';
import { SECTORS, STAGES, StartupSector, StartupStage, Startup } from '@/lib/data';
import styles from './page.module.css';

export default function EditStartupPage() {
  const router = useRouter();
  const { user, startups, isLoaded, updateStartup } = useStartupsStore();

  const myStartup = user
    ? startups.find((s) => s.ownerId === user.id) || startups[0]
    : null;

  const [formData, setFormData] = useState<Partial<Startup>>({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (myStartup) {
      setFormData({
        name: myStartup.name,
        logo: myStartup.logo,
        tagline: myStartup.tagline,
        description: myStartup.description,
        sector: myStartup.sector,
        stage: myStartup.stage,
        foundedYear: myStartup.foundedYear,
        teamSize: myStartup.teamSize,
        website: myStartup.website || '',
        linkedin: myStartup.linkedin || '',
        instagram: myStartup.instagram || '',
        twitter: myStartup.twitter || '',
        location: myStartup.location,
        latitude: myStartup.latitude,
        longitude: myStartup.longitude,
      });
    }
  }, [myStartup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myStartup) return;

    updateStartup(myStartup.id, formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  if (!isLoaded) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <div className={styles.loader}>Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!myStartup) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <div className={styles.emptyNotice}>
          <h2>No Startup Found</h2>
          <p>You have not listed a startup yet.</p>
          <Link href="/add" className={styles.addBtn}>
            <Plus size={16} /> Add Your Startup
          </Link>
        </div>
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
          <Link href="/my-startup" className={styles.backLink}>
            <ArrowLeft size={15} /> Back to Founder Area
          </Link>
          <h1 className={styles.heroTitle}>Edit Startup Profile</h1>
          <p className={styles.heroSubtitle}>
            Keep your company details, team metrics, and map location up to date.
          </p>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.container}>
          {isSaved && (
            <div className={styles.saveSuccessBanner}>
              <CheckCircle size={20} className={styles.successIconLucide} />
              <span>Changes saved successfully! Your updated profile is now live.</span>
            </div>
          )}

          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.sectionTitle}>Basic Info</div>

              <div className={styles.field}>
                <label>Startup Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label>Logo Emoji</label>
                <div className={styles.emojiPicker}>
                  {['🚀', '🏷️', '🤖', '⚡', '🌸', '⌚', '📚', '💳', '🌿', '☀️', '📊', '🎙️'].map(
                    (emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: emoji })}
                        className={`${styles.emojiBtn} ${
                          formData.logo === emoji ? styles.selectedEmoji : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label>Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label>Full Description</label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  className={styles.textarea}
                />
              </div>

              <div className={styles.sectionTitle}>Category & Stage</div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Sector</label>
                  <select
                    value={formData.sector || 'SaaS'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sector: e.target.value as StartupSector,
                      })
                    }
                    className={styles.select}
                  >
                    {SECTORS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Stage</label>
                  <select
                    value={formData.stage || 'Seed'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stage: e.target.value as StartupStage,
                      })
                    }
                    className={styles.select}
                  >
                    {STAGES.map((stg) => (
                      <option key={stg} value={stg}>
                        {stg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Founded Year</label>
                  <input
                    type="number"
                    value={formData.foundedYear || 2024}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        foundedYear: Number(e.target.value),
                      })
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label>Team Size</label>
                  <input
                    type="number"
                    value={formData.teamSize || 5}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        teamSize: Number(e.target.value),
                      })
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.sectionTitle}>Jaipur Location & Coordinates</div>

              <div className={styles.field}>
                <label>Location / Neighbourhood</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude || 26.85}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        latitude: parseFloat(e.target.value),
                      })
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude || 75.80}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitude: parseFloat(e.target.value),
                      })
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.sectionTitle}>Online Profiles</div>

              <div className={styles.field}>
                <label>Website</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label>LinkedIn</label>
                <input
                  type="url"
                  value={formData.linkedin || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.actionsRow}>
                <button type="submit" className={styles.saveBtn} id="edit-save-btn">
                  <Save size={16} /> Save Changes
                </button>

                <Link
                  href={`/startup/${myStartup.slug}`}
                  className={styles.viewBtn}
                >
                  View Public Profile <ExternalLink size={14} />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
