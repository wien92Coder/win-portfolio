import type { L10n } from './caseStudies';

/**
 * The two lanes the home page lets a visitor choose between. Everything that
 * depends on the active lane — hero visual, ticker, work list, services, and
 * the pre-selected contact goal — is read from here, so switching lanes never
 * needs new markup.
 *
 * Hero images are served from `public/images`; the stock credits that remain
 * for other sections are listed in CREDITS.md.
 */
export type LaneId = 'digital' | 'hospitality';

export interface LaneService {
  n: string;
  title: L10n;
  note: L10n;
}

export interface Lane {
  id: LaneId;
  index: string;
  name: L10n;
  note: L10n;
  image: string;
  imageAlt: L10n;
  keywords: Record<'id' | 'en', string[]>;
  services: LaneService[];
  worksLabel: L10n;
  worksHref: string;
  worksLink: L10n;
}

/** Local hero images (see CREDITS.md for stock credits). */
const IMG = (file: string) => `/images/${file}`;

export const LANES: Lane[] = [
  {
    id: 'digital',
    index: '001',
    name: { id: 'Digital & Web', en: 'Digital & Web' },
    note: { id: 'website, web-app, SaaS', en: 'websites, web apps, SaaS' },
    image: IMG('digital.jpg'),
    imageAlt: {
      id: 'Komputer retro menampilkan pixel-art di meja dekat jendela.',
      en: 'A retro computer showing pixel art on its screen beside a window.',
    },
    keywords: {
      id: ['Website', 'Web-app', 'SaaS', 'Desain grafis', 'Otomasi'],
      en: ['Websites', 'Web apps', 'SaaS', 'Graphic design', 'Automation'],
    },
    services: [
      {
        n: '01',
        title: { id: 'Website & landing page', en: 'Websites & landing pages' },
        note: { id: 'Cepat, rapi, mudah dicari.', en: 'Fast, tidy, easy to find.' },
      },
      {
        n: '02',
        title: { id: 'Web-app & tools', en: 'Web apps & tools' },
        note: {
          id: 'Kalkulator, dasbor, alat operasional.',
          en: 'Calculators, dashboards, operational tools.',
        },
      },
      {
        n: '03',
        title: { id: 'SaaS hospitality', en: 'Hospitality SaaS' },
        note: { id: 'Dari ide sampai produk berjalan.', en: 'From idea to a running product.' },
      },
      {
        n: '04',
        title: { id: 'Desain grafis', en: 'Graphic design' },
        note: { id: 'Identitas dan materi pendukung.', en: 'Identity and supporting material.' },
      },
    ],
    worksLabel: { id: 'Karya terpilih', en: 'Selected work' },
    worksHref: '/work',
    worksLink: { id: 'Lihat semua karya', en: 'View all work' },
  },
  {
    id: 'hospitality',
    index: '002',
    name: { id: 'Hospitality & Healthcare', en: 'Hospitality & Healthcare' },
    note: { id: 'operasional, people', en: 'operations, people' },
    image: IMG('resort.jpg'),
    imageAlt: {
      id: 'Halaman resor dengan kolam kecil dan sofa santai saat senja.',
      en: 'A resort courtyard with a small pool and lounge seating at dusk.',
    },
    keywords: {
      id: ['Operasional', 'Budaya layanan', 'Pelatihan', 'Kepemimpinan'],
      en: ['Operations', 'Service culture', 'Training', 'Leadership'],
    },
    services: [
      {
        n: '01',
        title: { id: 'Konsultasi operasional', en: 'Operations consulting' },
        note: {
          id: 'Diagnosis alur kerja, margin, dan standar layanan.',
          en: 'Diagnosing workflow, margin, and service standards.',
        },
      },
      {
        n: '02',
        title: { id: 'Budaya layanan', en: 'Service culture' },
        note: {
          id: 'SMART Care dari direksi sampai front office.',
          en: 'SMART Care from the boardroom to the front office.',
        },
      },
      {
        n: '03',
        title: { id: 'Pelatihan & asesmen', en: 'Training & assessment' },
        note: {
          id: 'Train-the-Trainer dan asesmen kompetensi.',
          en: 'Train-the-Trainer and competency assessment.',
        },
      },
      {
        n: '04',
        title: { id: 'Kepemimpinan GM', en: 'GM leadership' },
        note: {
          id: 'Coaching untuk pemimpin yang menggerakkan tim.',
          en: 'Coaching for leaders who move their teams.',
        },
      },
    ],
    worksLabel: { id: 'Studi kasus terpilih', en: 'Selected case studies' },
    worksHref: '/karya',
    worksLink: { id: 'Lihat semua studi kasus', en: 'View all case studies' },
  },
];

export function laneById(id: LaneId): Lane {
  return LANES.find((lane) => lane.id === id) ?? LANES[0];
}

/** Numbers are the same on both lanes: they are the proof of the operator
 *  background, and every one is traceable to a case study or the career record.
 *  Client labels stay anonymised. */
export const PROOF_STATS: { value: L10n; label: L10n }[] = [
  {
    value: { id: '30+', en: '30+' },
    label: { id: 'tahun hospitality & healthcare', en: 'years in hospitality & healthcare' },
  },
  {
    value: { id: '92%', en: '92%' },
    label: { id: 'CSI rumah sakit swasta (dari 70%)', en: 'private hospital CSI (from 70%)' },
  },
  {
    value: { id: '4,8', en: '4.8' },
    label: {
      id: 'rating Google rumah sakit bersejarah (dari 4,1)',
      en: 'heritage hospital Google rating (from 4.1)',
    },
  },
  {
    value: { id: '12x', en: '12x' },
    label: { id: 'pendapatan staf, Patuno Resort', en: 'staff income, Patuno Resort' },
  },
];

export const HOME_COPY = {
  heroLine: {
    id: 'Operator hospitality yang membangun teknologinya sendiri.',
    en: 'A hospitality operator who builds his own technology.',
  },
  /* Two lines on purpose: the hero renders them as a hand-written aside next
     to the headline, and the arrow below points at the lane rows. */
  clickHint: {
    id: ['Klik proyek', 'untuk lihat lebih jauh'],
    en: ['Click any project', 'to learn more'],
  },
  statementTitle: {
    id: 'saya membangun produk digital dan memimpin operasional dengan kejelasan dan ketelitian.',
    en: 'I build digital products and lead operations with clarity and care.',
  },
  statementBody: [
    {
      id: 'Operasional mengajari saya di mana uang bocor — food cost, shift bertingkat, harga kamar. Jadi saya membangun alat yang mengawasi angka-angka itu.',
      en: 'Operations taught me where the money leaks — food cost, staggered shifts, room rates. So I built the tools that watch those numbers.',
    },
    {
      id: 'Kode adalah alat operasional, bukan tujuan. Setiap sistem di sini lahir dari masalah nyata di bisnis nyata.',
      en: 'Code is an operational tool, not an end in itself. Every system here started as a real problem in a real business.',
    },
  ],
  proofLink: {
    id: 'Pendekatan yang sama membawa CSI sebuah rumah sakit dari 70% ke 92%. Lihat studi kasusnya',
    en: 'The same approach took a hospital’s CSI from 70% to 92%. See the case study',
  },
  worksEyebrow: { id: 'Karya terpilih', en: 'Selected work' },
  servicesEyebrow: { id: 'Layanan', en: 'Services' },
  ctaEyebrow: { id: 'Ajakan bertindak', en: 'Start a conversation' },
  ctaTitle: { id: 'Punya proyek atau kebutuhan konsultasi?', en: 'A project or a consulting need?' },
  ctaLead: { id: 'mari bekerja sama.', en: 'let’s work together.' },
  ctaButton: { id: 'Mulai proyek', en: 'Start a project' },
  ctaGoalLabel: { id: 'Tujuan', en: 'Goal' },
  worksCount: { id: 'empat proyek', en: 'four projects' },
  casesCount: { id: 'tiga studi kasus', en: 'three case studies' },
} as const;

export const GOALS: { id: LaneId | 'other'; label: L10n; note: L10n }[] = [
  {
    id: 'digital',
    label: { id: 'Proyek digital', en: 'Digital project' },
    note: { id: 'website, web-app, tools', en: 'website, web app, tools' },
  },
  {
    id: 'hospitality',
    label: { id: 'Konsultasi hospitality', en: 'Hospitality consulting' },
    note: { id: 'operasional, budaya layanan', en: 'operations, service culture' },
  },
  {
    id: 'other',
    label: { id: 'Lainnya', en: 'Something else' },
    note: { id: 'ceritakan saja', en: 'tell me about it' },
  },
];
