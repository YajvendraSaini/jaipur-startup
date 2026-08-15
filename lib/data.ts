// ─────────────────────────────────────────────────────────────
//  DATA LAYER  –  single source of truth
//  All views (Map, Directory, Profile, Admin) pull from here.
//  Replace mockStartups with a DB/API call to go live.
// ─────────────────────────────────────────────────────────────

export type StartupStatus = 'draft' | 'pending' | 'published' | 'rejected';

export type StartupStage =
  | 'Idea'
  | 'Pre-seed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Growth'
  | 'Bootstrapped';

export type StartupSector =
  | 'AI / ML'
  | 'FinTech'
  | 'EdTech'
  | 'HealthTech'
  | 'AgriTech'
  | 'SaaS'
  | 'eCommerce'
  | 'CleanTech'
  | 'Logistics'
  | 'Media'
  | 'Other';

export interface Founder {
  name: string;
  role: string;
  linkedin?: string;
}

export interface Startup {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  logo: string;          // URL or emoji fallback
  tagline: string;
  description: string;
  sector: StartupSector;
  stage: StartupStage;
  foundedYear: number;
  teamSize: number;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  location: string;      // human-readable Jaipur neighbourhood
  latitude: number;
  longitude: number;
  founders: Founder[];
  status: StartupStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Sectors & Stages lists (for filters/forms) ──────────────
export const SECTORS: StartupSector[] = [
  'AI / ML', 'FinTech', 'EdTech', 'HealthTech', 'AgriTech',
  'SaaS', 'eCommerce', 'CleanTech', 'Logistics', 'Media', 'Other',
];

export const STAGES: StartupStage[] = [
  'Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth', 'Bootstrapped',
];

// ── Mock data ────────────────────────────────────────────────
export const mockStartups: Startup[] = [
  {
    id: '1',
    ownerId: 'u1',
    name: 'Tagbox',
    slug: 'tagbox',
    logo: '🏷️',
    tagline: 'AI-powered brand content intelligence platform',
    description:
      'Tagbox helps brands collect, curate, and publish user-generated content across marketing channels. Their AI engine surfaces the most impactful UGC moments at scale.',
    sector: 'AI / ML',
    stage: 'Series A',
    foundedYear: 2019,
    teamSize: 45,
    website: 'https://tagbox.io',
    linkedin: 'https://linkedin.com/company/tagbox',
    location: 'Malviya Nagar, Jaipur',
    latitude: 26.8467,
    longitude: 75.8038,
    founders: [{ name: 'Aniket Bajpai', role: 'CEO' }],
    status: 'published',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: '2',
    ownerId: 'u2',
    name: 'RapidShyp',
    slug: 'rapidshyp',
    logo: '🚀',
    tagline: 'Simplifying cross-border eCommerce shipping',
    description:
      'RapidShyp is an international shipping aggregator that enables Indian eCommerce businesses to ship products globally at competitive rates with full tracking.',
    sector: 'Logistics',
    stage: 'Seed',
    foundedYear: 2021,
    teamSize: 30,
    website: 'https://rapidshyp.com',
    location: 'Vaishali Nagar, Jaipur',
    latitude: 26.9124,
    longitude: 75.7312,
    founders: [{ name: 'Akash Gupta', role: 'CEO' }],
    status: 'published',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
  },
  {
    id: '3',
    ownerId: 'u3',
    name: 'Jaipur Watch Company',
    slug: 'jaipur-watch-company',
    logo: '⌚',
    tagline: 'Handcrafted luxury timepieces rooted in Rajasthani heritage',
    description:
      'Combining centuries-old Rajasthani craft with modern horology. Every watch is hand-assembled using locally sourced materials and traditional artisan techniques.',
    sector: 'eCommerce',
    stage: 'Bootstrapped',
    foundedYear: 2016,
    teamSize: 12,
    website: 'https://jaipurwatchcompany.com',
    instagram: 'https://instagram.com/jaipurwatch',
    location: 'C-Scheme, Jaipur',
    latitude: 26.9048,
    longitude: 75.7971,
    founders: [{ name: 'Abhinav Pathak', role: 'Founder' }],
    status: 'published',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-05-20T00:00:00Z',
  },
  {
    id: '4',
    ownerId: 'u4',
    name: 'Nua',
    slug: 'nua',
    logo: '🌸',
    tagline: 'Period care reimagined for modern Indian women',
    description:
      'Nua makes customisable period care products—organic sanitary pads, cramp comfort, and wellness supplements—delivered as personalised monthly kits.',
    sector: 'HealthTech',
    stage: 'Series A',
    foundedYear: 2017,
    teamSize: 60,
    website: 'https://nua.com',
    linkedin: 'https://linkedin.com/company/nuawoman',
    location: 'Bani Park, Jaipur',
    latitude: 26.9260,
    longitude: 75.7900,
    founders: [{ name: 'Ravi Ramakrishnan', role: 'CEO' }],
    status: 'published',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-06-10T00:00:00Z',
  },
  {
    id: '5',
    ownerId: 'u5',
    name: 'Classplus',
    slug: 'classplus',
    logo: '📚',
    tagline: 'The super-app for tuition teachers & coaching institutes',
    description:
      'Classplus empowers over 150,000 educators to digitise their teaching business — from online classes and study materials to fee collection and parent engagement.',
    sector: 'EdTech',
    stage: 'Series B',
    foundedYear: 2018,
    teamSize: 500,
    website: 'https://classplusapp.com',
    location: 'Tonk Road, Jaipur',
    latitude: 26.8735,
    longitude: 75.8110,
    founders: [{ name: 'Mukul Rustagi', role: 'CEO' }, { name: 'Bhagtani', role: 'CTO' }],
    status: 'published',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z',
  },
  {
    id: '6',
    ownerId: 'u6',
    name: 'UrbanKisaan',
    slug: 'urbankisaan',
    logo: '🌿',
    tagline: 'Tech-enabled indoor farming for fresh hyper-local produce',
    description:
      'UrbanKisaan builds vertical farms inside cities, delivering pesticide-free vegetables and microgreens harvested within hours of your order.',
    sector: 'AgriTech',
    stage: 'Seed',
    foundedYear: 2018,
    teamSize: 25,
    website: 'https://urbankisaan.com',
    location: 'Sitapura Industrial Area, Jaipur',
    latitude: 26.7952,
    longitude: 75.8615,
    founders: [{ name: 'Srikant Bhashyam', role: 'CEO' }],
    status: 'published',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z',
  },
  {
    id: '7',
    ownerId: 'u7',
    name: 'CredRight',
    slug: 'credright',
    logo: '💳',
    tagline: 'Financial inclusion credit platform for underserved borrowers',
    description:
      'CredRight uses alternative data and ML to extend formal credit to small businesses and individuals excluded from traditional banking — bridging India\'s $380B credit gap.',
    sector: 'FinTech',
    stage: 'Series A',
    foundedYear: 2017,
    teamSize: 80,
    website: 'https://credright.com',
    linkedin: 'https://linkedin.com/company/credright',
    location: 'Mansarovar, Jaipur',
    latitude: 26.8613,
    longitude: 75.7474,
    founders: [{ name: 'Vineet Tyagi', role: 'CEO' }],
    status: 'published',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-05-15T00:00:00Z',
  },
  {
    id: '8',
    ownerId: 'u8',
    name: 'Boloindya',
    slug: 'boloindya',
    logo: '🎙️',
    tagline: 'Short-video platform for regional Indian language creators',
    description:
      'Boloindya is a regional-first short video and audio platform connecting Tier-2 and Tier-3 India through native language content and live interaction.',
    sector: 'Media',
    stage: 'Pre-seed',
    foundedYear: 2020,
    teamSize: 15,
    website: 'https://boloindya.com',
    instagram: 'https://instagram.com/boloindya',
    location: 'Malviya Nagar, Jaipur',
    latitude: 26.8511,
    longitude: 75.8096,
    founders: [{ name: 'Sanjay Sharma', role: 'CEO' }],
    status: 'published',
    createdAt: '2024-02-28T00:00:00Z',
    updatedAt: '2024-06-05T00:00:00Z',
  },
  {
    id: '9',
    ownerId: 'u9',
    name: 'Sarvam AI',
    slug: 'sarvam-ai',
    logo: '🤖',
    tagline: 'Building foundational AI for Indian languages',
    description:
      'Sarvam AI is developing large language models and speech systems specifically optimised for India\'s 22 scheduled languages, enabling true multilingual AI for a billion+ users.',
    sector: 'AI / ML',
    stage: 'Seed',
    foundedYear: 2023,
    teamSize: 35,
    website: 'https://sarvam.ai',
    linkedin: 'https://linkedin.com/company/sarvam-ai',
    location: 'Jagatpura, Jaipur',
    latitude: 26.8210,
    longitude: 75.8510,
    founders: [{ name: 'Vivek Raghavan', role: 'CEO' }, { name: 'Pratyush Kumar', role: 'CTO' }],
    status: 'published',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-07-10T00:00:00Z',
  },
  {
    id: '10',
    ownerId: 'u10',
    name: 'Indiranagar Farms',
    slug: 'indiranagar-farms',
    logo: '☀️',
    tagline: 'Solar micro-grids powering rural Rajasthani communities',
    description:
      'Indiranagar Farms installs and manages community-owned solar micro-grids in rural Rajasthan, providing clean affordable electricity to villages off the national grid.',
    sector: 'CleanTech',
    stage: 'Seed',
    foundedYear: 2022,
    teamSize: 18,
    location: 'Amber, Jaipur',
    latitude: 26.9887,
    longitude: 75.8559,
    founders: [{ name: 'Priya Sharma', role: 'Founder' }],
    status: 'published',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-06-25T00:00:00Z',
  },
  {
    id: '11',
    ownerId: 'u11',
    name: 'Zippy Analytics',
    slug: 'zippy-analytics',
    logo: '📊',
    tagline: 'Real-time business intelligence for D2C brands',
    description:
      'Zippy Analytics aggregates store, ad, and logistics data into a single dashboard, giving D2C founders instant clarity on unit economics and growth levers.',
    sector: 'SaaS',
    stage: 'Pre-seed',
    foundedYear: 2023,
    teamSize: 8,
    website: 'https://zippyanalytics.in',
    location: 'Raja Park, Jaipur',
    latitude: 26.9034,
    longitude: 75.8201,
    founders: [{ name: 'Ankit Verma', role: 'Founder' }],
    status: 'pending',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-07-12T00:00:00Z',
  },
];

// ── Helpers ─────────────────────────────────────────────────
export function getPublishedStartups(): Startup[] {
  return mockStartups.filter((s) => s.status === 'published');
}

export function getStartupBySlug(slug: string): Startup | undefined {
  return mockStartups.find((s) => s.slug === slug);
}

export function getPendingStartups(): Startup[] {
  return mockStartups.filter((s) => s.status === 'pending');
}
