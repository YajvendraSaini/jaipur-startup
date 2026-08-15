'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
        <span className={styles.brandBadge}>JAIPUR STARTUP</span>
        <h1 className={styles.title}>
          {isNewUser ? 'Create Founder Account' : 'Welcome Back'}
        </h1>
        <p className={styles.subtitle}>
          {redirect === '/add'
            ? 'Sign in or create an account to list your startup on the Jaipur map.'
            : 'Manage your Jaipur startup listing and profile.'}
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        className={styles.googleBtn}
        type="button"
        id="google-login-btn"
      >
        <span className={styles.googleIcon}>🌐</span> Continue with Google
      </button>

      <div className={styles.divider}>
        <span>or sign in with email</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {isNewUser && (
          <div className={styles.field}>
            <label>Your Full Name</label>
            <input
              type="text"
              placeholder="e.g. Vikramaditya Singh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isNewUser}
              className={styles.input}
            />
          </div>
        )}

        <div className={styles.field}>
          <label>Work Email</label>
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

        <div className={styles.field}>
          <label>Password</label>
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

        <button type="submit" className={styles.submitBtn} id="login-submit-btn">
          {isNewUser ? 'Register & Continue to Listing →' : 'Log In & Continue →'}
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
      <main className={styles.main}>
        <Suspense fallback={<div className={styles.card}>Loading...</div>}>
          <LoginContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
