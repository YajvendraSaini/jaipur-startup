'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStartupsStore } from '@/lib/store';
import { SECTORS, STAGES, StartupSector, StartupStage } from '@/lib/data';
import styles from './page.module.css';

export default function AddStartupPage() {
  const router = useRouter();
  const { user, isLoaded, addStartup } = useStartupsStore();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    logo: '🚀',
    tagline: '',
    description: '',
    sector: 'SaaS' as StartupSector,
    stage: 'Seed' as StartupStage,
    foundedYear: 2024,
    teamSize: 5,
    website: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    location: 'Malviya Nagar, Jaipur',
    latitude: 26.85,
    longitude: 75.80,
    founderName: user?.name || '',
    founderRole: 'Founder & CEO',
  });

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    addStartup({
      ownerId: user?.id || 'usr_guest',
      name: formData.name,
      slug: slug || `startup-${Date.now()}`,
      logo: formData.logo || '🚀',
      tagline: formData.tagline,
      description: formData.description,
      sector: formData.sector,
      stage: formData.stage,
      foundedYear: Number(formData.foundedYear),
      teamSize: Number(formData.teamSize),
      website: formData.website || undefined,
      linkedin: formData.linkedin || undefined,
      instagram: formData.instagram || undefined,
      twitter: formData.twitter || undefined,
      location: formData.location,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      founders: [
        {
          name: formData.founderName || user?.name || 'Founder',
          role: formData.founderRole || 'Founder & CEO',
        },
      ],
    });

    // Redirect to Founder Area with notification
    router.push('/my-startup?submitted=true');
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

  // Auth Protection Notice
  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <main className={styles.authNoticeMain}>
          <div className={styles.authNoticeCard}>
            <span className={styles.noticeIcon}>🏰</span>
            <h2>Sign in to list your startup</h2>
            <p>
              To create and manage your startup listing on the public Jaipur Startup Map, please login or register an account.
            </p>
            <div className={styles.authNoticeActions}>
              <Link
                href="/login?redirect=/add"
                className={styles.primaryAuthBtn}
                id="add-page-login-btn"
              >
                Log In & Continue →
              </Link>
              <Link
                href="/register?redirect=/add"
                className={styles.secondaryAuthBtn}
                id="add-page-register-btn"
              >
                Create Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.container}>
            <span className={styles.badge}>Founder Submission</span>
            <h1 className={styles.title}>List Your Startup</h1>
            <p className={styles.subtitle}>
              Put your startup on the official Jaipur ecosystem map and directory.
            </p>

            {/* Step Progress Bar */}
            <div className={styles.progressTracker}>
              {[
                { num: 1, label: 'Basic' },
                { num: 2, label: 'About' },
                { num: 3, label: 'Online' },
                { num: 4, label: 'Location' },
                { num: 5, label: 'Preview' },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`${styles.stepItem} ${
                    step === s.num
                      ? styles.activeStep
                      : step > s.num
                      ? styles.completedStep
                      : ''
                  }`}
                  onClick={() => s.num < step && setStep(s.num)}
                >
                  <span className={styles.stepNum}>{s.num > step ? s.num : step > s.num ? '✓' : s.num}</span>
                  <span className={styles.stepLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              {/* STEP 1: BASIC */}
              {step === 1 && (
                <div className={styles.stepContent}>
                  <h2 className={styles.stepHeading}>Step 1: Basic Information</h2>

                  <div className={styles.field}>
                    <label>Startup Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Fynd, Tagbox, Sarvam AI"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className={styles.input}
                      id="add-startup-name-input"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Startup Logo (Select Emoji / Icon) *</label>
                    <div className={styles.emojiPicker}>
                      {['🚀', '🏷️', '🤖', '⚡', '🌸', '⌚', '📚', '💳', '🌿', '☀️', '📊', '🎙️'].map(
                        (emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, logo: emoji })
                            }
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
                    <label>One-line Tagline *</label>
                    <input
                      type="text"
                      placeholder="e.g. AI-powered brand content intelligence platform"
                      value={formData.tagline}
                      onChange={(e) =>
                        setFormData({ ...formData, tagline: e.target.value })
                      }
                      required
                      className={styles.input}
                      id="add-startup-tagline-input"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: ABOUT */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <h2 className={styles.stepHeading}>Step 2: About & Stage</h2>

                  <div className={styles.field}>
                    <label>Detailed Description *</label>
                    <textarea
                      rows={4}
                      placeholder="Describe what your startup builds, the problem you solve, and your target audience..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                      className={styles.textarea}
                      id="add-startup-desc-input"
                    />
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>Industry Sector *</label>
                      <select
                        value={formData.sector}
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
                      <label>Funding / Growth Stage *</label>
                      <select
                        value={formData.stage}
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
                        min="2010"
                        max="2026"
                        value={formData.foundedYear}
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
                        min="1"
                        max="5000"
                        value={formData.teamSize}
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
                </div>
              )}

              {/* STEP 3: ONLINE */}
              {step === 3 && (
                <div className={styles.stepContent}>
                  <h2 className={styles.stepHeading}>Step 3: Web & Social Links</h2>

                  <div className={styles.field}>
                    <label>Website URL</label>
                    <input
                      type="url"
                      placeholder="https://yourcompany.com"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>LinkedIn Page</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/company/yourcompany"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>Instagram Handle</label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/yourhandle"
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData({ ...formData, instagram: e.target.value })
                        }
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Twitter / X Link</label>
                      <input
                        type="text"
                        placeholder="https://x.com/yourhandle"
                        value={formData.twitter}
                        onChange={(e) =>
                          setFormData({ ...formData, twitter: e.target.value })
                        }
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: LOCATION */}
              {step === 4 && (
                <div className={styles.stepContent}>
                  <h2 className={styles.stepHeading}>Step 4: Jaipur Location</h2>

                  <div className={styles.field}>
                    <label>Jaipur Area / Neighbourhood *</label>
                    <input
                      type="text"
                      placeholder="e.g. Malviya Nagar, Jaipur or C-Scheme, Jaipur"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>Latitude (Jaipur: ~26.8 to ~27.0)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.latitude}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            latitude: parseFloat(e.target.value) || 26.85,
                          })
                        }
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Longitude (Jaipur: ~75.7 to ~75.9)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.longitude}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            longitude: parseFloat(e.target.value) || 75.80,
                          })
                        }
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PREVIEW */}
              {step === 5 && (
                <div className={styles.stepContent}>
                  <h2 className={styles.stepHeading}>Step 5: Public Profile Preview</h2>
                  <p className={styles.previewSubtext}>
                    This is how your startup will appear on the Jaipur Startup Map & Directory once approved by Admin.
                  </p>

                  <div className={styles.previewBox}>
                    <div className={styles.previewLogo}>{formData.logo}</div>
                    <h3 className={styles.previewTitle}>{formData.name || 'Startup Name'}</h3>
                    <div className={styles.previewPills}>
                      <span className={styles.pSector}>{formData.sector}</span>
                      <span className={styles.pStage}>{formData.stage}</span>
                      <span className={styles.pLoc}>📍 {formData.location}</span>
                    </div>
                    <p className={styles.previewTag}>&ldquo;{formData.tagline}&rdquo;</p>
                    <p className={styles.previewDesc}>{formData.description}</p>
                  </div>
                </div>
              )}

              {/* Form Navigation Buttons */}
              <div className={styles.formNav}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className={styles.prevBtn}
                  >
                    ← Back
                  </button>
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className={styles.nextBtn}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    id="submit-startup-final-btn"
                  >
                    🚀 Submit Startup for Review
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
