/**
 * Anonymised hospital case studies — the source of truth for the copy.
 *
 * HARD RULE: no real hospital name, abbreviation, city, or district may appear
 * here, in UI text, file names, slugs, alt text, metadata, or commit messages.
 * The client owns no publication permission. Region is always "Central Java" /
 * "Jawa Tengah".
 *
 * Every user-facing string is bilingual so the section can follow the site-wide
 * ID/EN switch without a second translation layer.
 */
export type Lang = 'id' | 'en';
export type L10n = Record<Lang, string>;

export interface CaseMetric {
  value: L10n;
  label: L10n;
}

export interface CaseStudy {
  slug: string;
  /** Broad sector — the anonymised descriptor, never an institution. */
  sector: L10n;
  /** Scale only, for the detail page's meta row. */
  scale: L10n;
  heroMetric: CaseMetric;
  /** Three items; the hero metric is always first. */
  metrics: CaseMetric[];
  title: L10n;
  tagline: L10n;
  tags: L10n[];
  client: L10n;
  period: L10n;
  role: L10n;
  /** Areas addressed; explained in the UI as the SMART Care framework. */
  focus: L10n;
  context: L10n;
  approach: L10n[];
  results: L10n[];
  /** Abstract Unsplash placeholder — illustrative, not the client's premises. */
  image: string;
  imageAlt: L10n;
  /** Crop anchor for the 16:9 frame. Portrait photos need a lower anchor than
   *  the default top edge, or the frame shows only their ceiling. */
  imagePosition?: string;
  /** Reserved for an anonymous testimonial; not rendered until copy exists.
   *  quote?: { text: L10n; attribution: L10n };
   */
}

/** Served locally (see CREDITS.md). The `-v2` suffix is deliberate: nginx
 *  caches /images/ for 30 days as immutable, so a new URL is the only way a
 *  replaced photo reaches visitors who already hold the old one. Bump the
 *  suffix whenever one of these files is swapped. */
const ARCHITECTURE = '/images/case-large-private-v2.jpg';
const GLASS_TOWERS = '/images/case-regional-government-v2.jpg';
const ARCHES = '/images/case-heritage-v2.jpg';

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'large-private-hospital',
    sector: { id: 'Rumah sakit swasta', en: 'Private hospital' },
    scale: { id: '±2.000 staf dan dokter', en: '~2,000 staff and doctors' },
    title: {
      id: 'Rumah Sakit Swasta Tipe Besar, Jawa Tengah',
      en: 'Large Private Hospital, Central Java',
    },
    tagline: {
      id: 'Membawa standar pelayanan sekelas hotel ke seluruh lini rumah sakit, dengan peningkatan kepuasan pasien sebesar 22 poin.',
      en: 'Bringing hotel-grade service standards to every level of the hospital, with a 22-point rise in patient satisfaction.',
    },
    tags: [
      { id: 'Healthcare', en: 'Healthcare' },
      { id: 'Budaya Pelayanan', en: 'Service Culture' },
      { id: 'Train-the-Trainer', en: 'Train-the-Trainer' },
    ],
    client: {
      id: 'Rumah sakit swasta di bawah naungan yayasan, ±2.000 staf dan dokter',
      en: 'Private hospital under a foundation, ~2,000 staff and doctors',
    },
    period: { id: '2015 - 2016', en: '2015 - 2016' },
    role: { id: 'Lead Consultant & Trainer', en: 'Lead Consultant & Trainer' },
    focus: { id: 'People & Process', en: 'People & Process' },
    heroMetric: {
      value: { id: '70% → 92%', en: '70% → 92%' },
      label: { id: 'CSI / Customer Satisfaction Index', en: 'Customer Satisfaction Index (CSI)' },
    },
    metrics: [
      {
        value: { id: '70% → 92%', en: '70% → 92%' },
        label: { id: 'CSI / Customer Satisfaction Index', en: 'Customer Satisfaction Index (CSI)' },
      },
      {
        value: { id: '~2.000', en: '~2,000' },
        label: { id: 'staf & dokter', en: 'staff & doctors' },
      },
      {
        value: { id: '±1,5 tahun', en: '~1.5 years' },
        label: { id: 'durasi program', en: 'program duration' },
      },
    ],
    context: {
      id: 'Seiring ekspansi fasilitasnya, rumah sakit ini ingin menghadirkan pelayanan yang setara dengan standar hospitality internasional, dengan membangun di atas nilai dan pengalaman panjang seluruh staf dan dokternya.',
      en: 'As its facilities expanded, the hospital set out to align its service with international hospitality standards, building on the values and long experience of its staff and doctors.',
    },
    approach: [
      {
        id: 'Train-the-Trainer, Leadership & Effective Communication untuk seluruh jenjang kepemimpinan, dari Direktur hingga Penanggung Jawab (PJ).',
        en: 'Train-the-Trainer, Leadership & Effective Communication programs for the full chain of command, from Directors to Persons-in-Charge.',
      },
      {
        id: 'Coaching langsung agar para pemimpin percaya diri menjadi penggerak budaya layanan.',
        en: 'Direct coaching so leaders could confidently champion the service culture themselves.',
      },
      {
        id: 'Kaskade bertahap program SMART Care ke seluruh staf, dipimpin oleh atasan mereka sendiri.',
        en: 'Staged cascade of SMART Care training to every staff member, led by their own leaders.',
      },
    ],
    results: [
      {
        id: 'Kepuasan pasien (CSI) naik dari 70% menjadi 92%.',
        en: 'Patient satisfaction (CSI) rose from 70% to 92%.',
      },
      {
        id: 'Interaksi dengan pasien, keluarga, dan pengunjung semakin hangat.',
        en: 'Warmer engagement with patients, families, and visitors.',
      },
      {
        id: 'Kerja sama antarunit dan antarbangsal makin solid.',
        en: 'Stronger teamwork across departments and wards.',
      },
    ],
    image: ARCHITECTURE,
    imageAlt: {
      id: 'Ilustrasi koridor rumah sakit dengan seorang klinisi — bukan lokasi klien.',
      en: 'Hospital corridor illustration with a clinician — not the client’s premises.',
    },
  },
  {
    slug: 'regional-government-hospital',
    sector: { id: 'Rumah sakit pemerintah daerah', en: 'Regional government hospital' },
    scale: { id: '1.000+ staf', en: '1,000+ staff' },
    title: {
      id: 'Rumah Sakit Umum Daerah, Jawa Tengah',
      en: 'Regional Government Hospital, Central Java',
    },
    tagline: {
      id: 'Membangun budaya pelayanan publik yang unggul, hingga kini dikenal luas karena kualitas layanannya.',
      en: 'Building a culture of public service excellence, now widely recognized for the quality of its care.',
    },
    tags: [
      { id: 'Healthcare', en: 'Healthcare' },
      { id: 'Pelayanan Publik', en: 'Public Service' },
      { id: 'Coaching Kepemimpinan', en: 'Leadership Coaching' },
    ],
    client: {
      id: 'Rumah sakit milik pemerintah daerah, 1.000+ staf',
      en: 'Regional government hospital, 1,000+ staff',
    },
    period: { id: '2016 - 2017 (20 bulan)', en: '2016 - 2017 (20 months)' },
    role: { id: 'Lead Consultant & Trainer', en: 'Lead Consultant & Trainer' },
    focus: {
      id: 'People, Process & Product (sebagian)',
      en: 'People, Process & Product (selected)',
    },
    heroMetric: {
      value: { id: 'Dikenal luas', en: 'Widely recognized' },
      label: { id: 'kualitas layanan', en: 'service quality' },
    },
    metrics: [
      {
        value: { id: 'Dikenal luas', en: 'Widely recognized' },
        label: { id: 'kualitas layanan', en: 'service quality' },
      },
      {
        value: { id: '1.000+', en: '1,000+' },
        label: { id: 'staf', en: 'staff' },
      },
      {
        value: { id: '20 bulan', en: '20 months' },
        label: { id: 'durasi program', en: 'program duration' },
      },
    ],
    context: {
      id: 'Sebagai rumah sakit milik pemerintah daerah, institusi ini berkomitmen meningkatkan mutu pelayanan publik sekaligus memperkuat rasa memiliki dan semangat pengabdian seluruh insan rumah sakit.',
      en: 'As a regional government hospital, the institution was committed to raising the quality of its public service and strengthening the sense of purpose and ownership among its people.',
    },
    approach: [
      {
        id: 'Program SMART Care untuk seluruh jenjang kepemimpinan, membangun budaya layanan yang seragam.',
        en: 'SMART Care program delivered across the full chain of command, building a shared service culture.',
      },
      {
        id: 'Coaching kepemimpinan individual agar setiap pimpinan menjadi teladan dan penggerak timnya.',
        en: "One-on-one leadership coaching to strengthen each leader's role as a role model and motivator.",
      },
      {
        id: 'Kemudahan akses pasien lewat jalur reservasi terpisah (telepon/Customer Service dan WhatsApp), melengkapi pendaftaran langsung.',
        en: 'Easier access for patients through separate reservation channels (phone/Customer Service and WhatsApp), complementing walk-in registration.',
      },
    ],
    results: [
      {
        id: 'Budaya layanan bergeser secara bertahap dan berkelanjutan, bukan sekadar kampanye sesaat.',
        en: 'Service culture shifted steadily, built through consistent daily practice rather than a one-off campaign.',
      },
      {
        id: 'Kini dikenal luas karena kualitas pelayanannya.',
        en: 'Now widely recognized for the quality of its service.',
      },
      {
        id: 'Para pimpinan mengambil peran aktif menjaga mutu layanan di unit masing-masing.',
        en: 'Leaders took active ownership of service quality in their units.',
      },
    ],
    image: GLASS_TOWERS,
    imageAlt: {
      id: 'Ilustrasi arsitektur institusional — bukan lokasi klien.',
      en: 'Institutional architecture illustration — not the client’s premises.',
    },
  },
  {
    slug: 'heritage-private-hospital',
    sector: { id: 'Rumah sakit swasta bersejarah', en: 'Heritage private hospital' },
    scale: { id: 'Sejarah pelayanan yang panjang', en: 'A long history of service' },
    title: {
      id: 'Rumah Sakit Swasta Bersejarah, Jawa Tengah',
      en: 'Heritage Private Hospital, Central Java',
    },
    tagline: {
      id: 'Menghadirkan kehangatan di atas tradisi disiplin yang kokoh: rating Google naik dari 4,1 menjadi 4,8 dalam dua belas bulan.',
      en: 'Bringing warmth to a strong tradition of discipline: Google rating up from 4.1 to 4.8 in twelve months.',
    },
    tags: [
      { id: 'Healthcare', en: 'Healthcare' },
      { id: 'Budaya Pelayanan', en: 'Service Culture' },
      { id: 'Coaching Kepemimpinan', en: 'Leadership Coaching' },
    ],
    client: {
      id: 'Rumah sakit swasta di bawah naungan yayasan, dengan sejarah pelayanan yang panjang',
      en: 'Private hospital under a foundation, with a long history of service',
    },
    period: { id: '2023 - 2024 (12 bulan)', en: '2023 - 2024 (12 months)' },
    role: { id: 'Lead Consultant & Coach', en: 'Lead Consultant & Coach' },
    focus: { id: 'People', en: 'People' },
    heroMetric: {
      value: { id: '4,1 → 4,8', en: '4.1 → 4.8' },
      label: { id: 'Rating Google', en: 'Google rating' },
    },
    metrics: [
      {
        value: { id: '4,1 → 4,8', en: '4.1 → 4.8' },
        label: { id: 'Rating Google', en: 'Google rating' },
      },
      {
        value: { id: 'Sejarah panjang', en: 'Long heritage' },
        label: { id: 'tradisi layanan', en: 'service tradition' },
      },
      {
        value: { id: '12 bulan', en: '12 months' },
        label: { id: 'durasi program', en: 'program duration' },
      },
    ],
    context: {
      id: 'Dengan sejarah pelayanan yang panjang, rumah sakit ini memiliki budaya disiplin dan standar kerja yang sangat kuat. Ambisinya adalah memadukan kekuatan tersebut dengan pengalaman pasien yang lebih personal dan hangat.',
      en: 'With a long history of service, the hospital carries a deeply rooted culture of discipline and high work standards. Its ambition was to pair that strength with a more personal, warmer patient experience.',
    },
    approach: [
      {
        id: 'Program SMART Care dengan fokus kuat pada aspek People.',
        en: 'SMART Care program with a strong focus on People.',
      },
      {
        id: 'Coaching individual intensif bersama para Direktur dan pimpinan unit, para pemimpin yang membentuk budaya kerja sehari-hari.',
        en: 'Intensive one-on-one coaching with the Directors and unit leaders who shape daily culture.',
      },
      {
        id: 'Kolaborasi erat agar kebiasaan layanan baru tumbuh dari nilai dan tradisi rumah sakit sendiri.',
        en: "Close collaboration so that new service habits grew from within the hospital's own values and traditions.",
      },
    ],
    results: [
      {
        id: 'Rating Google naik dari 4,1 menjadi 4,8 bintang dalam 12 bulan.',
        en: 'Google rating rose from 4.1 to 4.8 stars in 12 months.',
      },
      {
        id: 'Keterlibatan atasan dan bawahan semakin erat.',
        en: 'Closer engagement between leaders and their teams.',
      },
      {
        id: 'Kerja sama antarunit makin solid.',
        en: 'Stronger teamwork across units.',
      },
    ],
    image: ARCHES,
    imagePosition: '50% 55%',
    imageAlt: {
      id: 'Ilustrasi koridor dengan lengkungan — bukan lokasi klien.',
      en: 'Arched corridor illustration — not the client’s premises.',
    },
  },
];

/** Section chrome and the one-off confidentiality note. */
export const CASE_SECTION = {
  label: { id: 'Studi kasus', en: 'Case studies' },
  index: { id: '01 — 03', en: '01 — 03' },
  title: {
    id: 'tiga transformasi layanan rumah sakit.',
    en: 'three hospital service transformations.',
  },
  intro: {
    id: 'Tiga institusi di Jawa Tengah, tiga titik awal yang berbeda. Identitas klien dirahasiakan; angka dan hasilnya apa adanya.',
    en: 'Three institutions in Central Java, three different starting points. Client identities are withheld; the numbers and outcomes are as they are.',
  },
  labels: {
    context: { id: 'Konteks & Ambisi', en: 'Context & Ambition' },
    approach: { id: 'Pendekatan', en: 'Approach' },
    results: { id: 'Hasil', en: 'Results' },
    focus: { id: 'Area yang digarap', en: 'Areas addressed' },
    focusNote: { id: 'Kerangka SMART Care', en: 'SMART Care framework' },
    client: { id: 'Klien', en: 'Client' },
    period: { id: 'Periode', en: 'Period' },
    role: { id: 'Peran', en: 'Role' },
    sector: { id: 'Sektor', en: 'Sector' },
    scale: { id: 'Skala', en: 'Scale' },
    program: { id: 'Program', en: 'Program' },
  },
  csiNote: {
    id: 'Customer Satisfaction Index, hasil survei internal rumah sakit.',
    en: "Customer Satisfaction Index, based on the hospital's internal survey.",
  },
  footer: {
    id: 'Identitas klien dirahasiakan demi menjaga kerahasiaan. Referensi dan detail proyek tersedia atas permintaan.',
    en: 'Client identities are withheld for confidentiality. References and project details are available upon request.',
  },
  allCases: { id: 'Semua studi kasus', en: 'All case studies' },
  atGlance: { id: 'Sekilas', en: 'At a glance' },
  caseLabel: { id: 'Studi kasus', en: 'Case study' },
  nextCase: { id: 'Berikutnya', en: 'Next' },
  backHome: { id: 'Kembali ke Hospitality', en: 'Back to Hospitality' },
  detailCta: {
    id: 'Ingin hasil serupa untuk institusi Anda?',
    en: 'Want a similar result for your institution?',
  },
  detailCtaButton: { id: 'Jadwalkan konsultasi', en: 'Schedule a consultation' },
  illustration: {
    id: 'Ilustrasi — bukan lokasi klien.',
    en: 'Illustration — not the client’s premises.',
  },
} as const;

export function pick(value: L10n, lang: Lang): string {
  return value[lang];
}

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((item) => item.slug === slug);
}
