'use client';

import { useState, useEffect } from 'react';
import { Startup, mockStartups } from './data';

const STORAGE_KEY = 'jaipur_startups_data';
const USER_KEY = 'jaipur_startup_user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'founder' | 'admin';
}

export function getStoredStartups(): Startup[] {
  if (typeof window === 'undefined') return mockStartups;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockStartups));
      return mockStartups;
    }
    return JSON.parse(data);
  } catch {
    return mockStartups;
  }
}

export function saveStoredStartups(startups: Startup[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(startups));
  } catch (e) {
    console.error('Failed to save startups', e);
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(USER_KEY);
    if (data) return JSON.parse(data);
    return null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(USER_KEY);
  } else {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function useStartupsStore() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setStartups(getStoredStartups());
    setUser(getCurrentUser());
    setIsLoaded(true);
  }, []);

  const addStartup = (newStartupData: Omit<Startup, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newStartup: Startup = {
      ...newStartupData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newStartup, ...startups];
    setStartups(updated);
    saveStoredStartups(updated);
    return newStartup;
  };

  const updateStartup = (id: string, updates: Partial<Startup>) => {
    const updated = startups.map((s) =>
      s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
    );
    setStartups(updated);
    saveStoredStartups(updated);
  };

  const updateStatus = (id: string, status: Startup['status']) => {
    updateStartup(id, { status });
  };

  const loginUser = (email: string, name: string, role: 'founder' | 'admin' = 'founder') => {
    const u: User = { id: 'usr_' + Date.now(), name, email, role };
    setUser(u);
    setCurrentUser(u);
    return u;
  };

  const logoutUser = () => {
    setUser(null);
    setCurrentUser(null);
  };

  return {
    startups,
    publishedStartups: startups.filter((s) => s.status === 'published'),
    pendingStartups: startups.filter((s) => s.status === 'pending'),
    user,
    isLoaded,
    addStartup,
    updateStartup,
    updateStatus,
    loginUser,
    logoutUser,
  };
}
