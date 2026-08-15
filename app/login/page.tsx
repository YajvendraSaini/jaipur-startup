'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Globe, Mail, Lock, User as UserIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStartupsStore } from '@/lib/store';
import styles from './page.module.css';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/add';

  const { loginUser } = useStartupsStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const userName = name || email.split('@')[0];
    loginUser(email, userName, email.includes('admin') ? 'admin' : 'founder');
    router.push(redirect);
  };

  const handleGoogleLogin = () => {
    loginUser('google.founder@jaipurstartup.in', 'Jaipur Founder', 'founder');
    router.push(redirect);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/text logo.png"
          alt="Jaipur Startup"
          className={styles.brandLogo}
        />
        <h1 className={styles.title}>
          {isNewUser ? 'Create Founder Account' : 'Welcome Back'}
        </h1>
        <p className={styles.subtitle}>
          {redirect === '/add'
            ? 'Sign in or create an account to list your startup on the Jaipur map.'
            : 'Manage your Jaipur startup listing and ecosystem profile.'}
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        className={styles.googleBtn}
        type="button"
        id="google-login-btn"
      >
        <Globe size={18} /> Continue with Google
      </button>

      <div className={styles.divider}>
        <span>or sign in with email</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {isNewUser && (
          <div className={styles.field}>
            <label>Your Full Name</label>
            <div className={styles.inputWithIcon}>
              <UserIcon size={16} className={styles.inputIcon} />
              <input
                type="text"
                placeholder="e.g. Vikramaditya Singh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isNewUser}
                className={styles.input}
              />
            </div>
          </div>
        )}

        <div className={styles.field}>
          <label>Work Email</label>
          <div className={styles.inputWithIcon}>
            <Mail size={16} className={styles.inputIcon} />
            <input
              type="email"
              placeholder="founder@yourcompany.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              id="login-email-input"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <div className={styles.inputWithIcon}>
            <Lock size={16} className={styles.inputIcon} />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              id="login-password-input"
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} id="login-submit-btn">
          {isNewUser ? 'Register & Continue to Listing' : 'Log In & Continue'}{' '}
          <ArrowRight size={15} />
        </button>
      </form>

      <div className={styles.toggleFooter}>
        {isNewUser ? (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setIsNewUser(false)}
              className={styles.toggleBtn}
            >
              Log In
            </button>
          </p>
        ) : (
          <p>
            New founder in Jaipur?{' '}
            <button
              type="button"
              onClick={() => setIsNewUser(true)}
              className={styles.toggleBtn}
            >
              Register Account
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
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
          <h1 className={styles.heroTitle}>Founder Portal</h1>
          <p className={styles.heroSubtitle}>
            Join Jaipur&rsquo;s official startup network and showcase your venture.
          </p>
        </div>
      </section>

      <main className={styles.main}>
        <Suspense fallback={<div className={styles.card}>Loading...</div>}>
          <LoginContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
