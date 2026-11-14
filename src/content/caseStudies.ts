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
  /** The fork in the road: what else was on the table, the constraint that
   *  made it hard, and why this path was chosen. First person on purpose —
   *  the reader is judging the judgement, not the deliverables. */
  decision: L10n;
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
      id: 'Kapasitas rumah sakit bertambah, tetapi kepuasan pasien tertahan di 70%. Fasilitas baru membuat pasien menuntut pengalaman yang setara, sementara sekitar 2.000 staf dan dokter sudah bertahun-tahun bekerja dengan caranya masing-masing. Pelayanan tidak bisa berhenti untuk pelatihan, dan program punya batas waktu.',
      en: 'Capacity grew, but patient satisfaction stayed at 70%. New facilities raised what patients expected to match, while around 2,000 staff and doctors had spent years working their own way. Service could not stop for training, and the program had a fixed window.',
    },
    decision: {
      id: 'Saya memilih melatih pemimpin internal, bukan mendatangkan trainer untuk mengajar seluruh staf. Jalan yang lebih cepat adalah program massal dari luar: seragam, terukur, selesai dalam beberapa minggu — tetapi begitu kontrak berakhir, kebiasaan barunya ikut pergi. Kaskade train-the-trainer lebih lambat dan bergantung pada konsistensi tiap kepala unit. Risiko itu saya ambil karena perubahan harus tetap berjalan setelah saya pulang, dan staf lebih percaya pada atasan yang mereka kenal.',
      en: 'I chose to train internal leaders rather than bring in trainers to teach every staff member. The faster route was a mass program from outside: uniform, measurable, finished in weeks — but when the contract ended, so did the new habits. The train-the-trainer cascade was slower and depended on the consistency of each unit head. I took that risk because the change had to keep running after I left, and staff trust leaders they already know.',
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
      value: { id: '1.000+', en: '1,000+' },
      label: { id: 'staf', en: 'staff' },
    },
    metrics: [
      {
        value: { id: '1.000+', en: '1,000+' },
        label: { id: 'staf', en: 'staff' },
      },
      {
        value: { id: '20 bulan', en: '20 months' },
        label: { id: 'durasi program', en: 'program duration' },
      },
      {
        // Recognition is real but it is not a measured figure: it closes the
        // strip instead of holding the slot every other study fills with a
        // before-and-after number.
        value: { id: 'Dikenal luas', en: 'Widely recognized' },
        label: { id: 'kualitas layanan', en: 'service quality' },
      },
    ],
    context: {
      id: 'Sebagai rumah sakit pemerintah daerah dengan 1.000+ staf, mutu layanannya dinilai langsung oleh warga yang datang dengan harapan tinggi dan pilihan terbatas. Semangat pengabdian sudah kuat, tetapi kebiasaan layanan berbeda antarbagian, dan pasien masih mengantre di loket untuk pendaftaran yang seharusnya bisa dipesan lebih dulu. Sebagai konsultan, saya tidak bisa mengubah struktur, kebijakan, atau komposisi pegawai.',
      en: 'As a regional government hospital with 1,000+ staff, service quality was judged directly by citizens arriving with high expectations and few alternatives. Commitment was strong, but service habits differed between departments, and patients still queued at the counter for registrations that could have been booked ahead. As a consultant I could not change structure, policy, or the roster.',
    },
    decision: {
      id: 'Saya memilih bergerak lewat hal yang bisa dikendalikan staf sendiri, yaitu satu kanal reservasi terpisah lewat telepon dan WhatsApp, daripada mengusulkan perubahan kebijakan pendaftaran. Perubahan kebijakan akan memakan waktu lebih lama dari 20 bulan program dan berisiko berhenti di meja birokrasi; kanal reservasi bisa jalan dalam hitungan minggu. Efek sampingnya justru yang saya cari: staf melihat sendiri bahwa perubahan kecil terasa oleh pasien, sehingga mereka lebih terbuka pada pelatihan budaya layanan yang lebih dalam.',
      en: 'I chose to work through what staff could control themselves, a separate reservation channel by phone and WhatsApp, instead of proposing a change to registration policy. Policy change would have outlasted the 20-month program and could stall in bureaucracy; a reservation channel could run within weeks. The side effect was the one I wanted: staff saw for themselves that a small change reached patients, so they were more open to the deeper service-culture work.',
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
      id: 'Disiplin kerja di rumah sakit ini sudah tinggi dan bertahan puluhan tahun, tetapi pengalaman pasien belum mencerminkan kehangatannya: rating Google 4,1. Reputasi adalah kanal kedatangan pasien yang utama, jadi setiap bintang yang hilang berbiaya. Kendalanya waktu, hanya 12 bulan, dan Direksi yang sudah menjalankan standarnya sendiri bertahun-tahun; program yang terasa dari luar akan ditolak dengan sopan.',
      en: 'Working discipline here was already high and had held for decades, but the patient experience did not reflect that warmth: a 4.1 Google rating. Reputation is the main arrival channel for a hospital of this standing, so every missing star costs. The constraint was time, twelve months only, and directors who had run their own standards for years; a program that felt imported would be politely refused.',
    },
    decision: {
      id: 'Saya memilih tidak membawa standar layanan baru, melainkan meng-coach Direktur dan pimpinan unit satu per satu lebih dulu, lalu membiarkan kebiasaan baru tumbuh dari nilai yang sudah mereka pegang. Alternatifnya lebih rapi di atas kertas: satu SOP layanan seragam yang bisa saya presentasikan di hari pertama. Saya menolaknya karena di rumah sakit dengan tradisi sepanjang ini, SOP dari luar akan menjadi dokumen, bukan kebiasaan. Konsekuensinya lebih lambat dan tidak serapi rencana, tetapi hasilnya muncul di rating, bukan di kepatuhan formulir.',
      en: 'I chose not to import a new service standard. Instead I coached the Directors and unit leaders one to one first, then let new habits grow from values they already held. The tidier alternative was a single uniform service SOP I could present on day one. I refused it because in a hospital with a tradition this long, an outside SOP becomes a document rather than a habit. The trade-off was slower, less tidy work, but the result shows up in the rating, not in form compliance.',
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
  /** The one place SMART Care is explained: every later mention can assume it. */
  smartCare: {
    id: 'SMART Care adalah kerangka pelatihan budaya layanan yang saya susun dan turunkan lewat train-the-trainer: pemimpin dilatih dan di-coach lebih dulu, lalu mereka mengalirkannya ke seluruh staf. Kerangka yang sama dipakai di ketiga kasus di bawah.',
    en: 'SMART Care is the service-culture training framework I built and cascade through train-the-trainer: leaders are trained and coached first, then they carry it to every staff member. The same framework runs through all three cases below.',
  },
  labels: {
    context: { id: 'Konteks & Ambisi', en: 'Context & Ambition' },
    decision: { id: 'Keputusan sulit', en: 'The hard call' },
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
