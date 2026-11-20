export const PORTFOLIO_LINKS = {
  github: 'https://github.com/muelharr',
  // TODO: Ganti dengan path/URL berkas CV PDF (mis. '/cv-samuel.pdf' di folder public)
  cv: '#',
  // TODO: Ganti dengan URL repositori FTP spesifik
  ftpRepo: 'https://github.com/muelharr',
  // TODO: Ganti dengan URL repositori Shuttle Travel spesifik
  shuttleRepo: 'https://github.com/muelharr',
  bimcheckRepo: 'https://github.com/muelharr/Bimcheck',
  swasembadaRepo: 'https://github.com/muelharr/ML-internal',
  email: 'lumbantoruansamuel07@gmail.com',
  linkedin: 'https://www.linkedin.com/in/samuel-lumbantoruan-a79a321a6',
} as const;

export interface NavItem {
  index: string;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { index: '01', label: 'Studi Kasus', href: '#studi-kasus' },
  { index: '02', label: 'Spesifikasi', href: '#kompetensi' },
  { index: '03', label: 'Log Lab', href: '#lab' },
  { index: '04', label: 'Kontak', href: '#kontak' },
];

export type CaseStudyId = 'ftp' | 'shuttle' | 'swasembada';

export interface CaseStudy {
  id: CaseStudyId;
  code: string;
  title: string;
  tags: string[];
  context: string;
  approach: string;
  result: string;
  repoUrl?: string;
  privateStatus?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'ftp',
    code: 'CASE-01',
    title: 'Aplikasi FTP Multi-Client Terenkripsi',
    tags: ['Python', 'TCP/IP Socket', 'Multi-Thread', 'Fernet', 'Gzip'],
    context:
      'Protokol transfer berkas standar sering mengirim data dalam bentuk teks polos dan mengalami antrean saat diakses banyak pengguna bersamaan.',
    approach:
      'Membangun sistem client-server berbasis TCP/IP socket dari nol menggunakan Python. Menerapkan multi-threading untuk menangani koneksi paralel, kompresi Gzip untuk menghemat ukuran payload di jaringan, dan enkripsi simetris Fernet selama transmisi.',
    result:
      'Server melayani transfer berkas dari beberapa client secara bersamaan dengan pemakaian bandwidth lebih hemat dan transmisi data terenkripsi.',
    repoUrl: PORTFOLIO_LINKS.ftpRepo,
  },
  {
    id: 'shuttle',
    code: 'CASE-02',
    title: 'Sistem Reservasi Shuttle Travel (Microservices)',
    tags: ['TypeScript', 'REST', 'gRPC', 'RabbitMQ', 'Docker', 'MySQL'],
    context:
      'Sistem reservasi dengan transaksi bersamaan memerlukan pemisahan layanan agar lonjakan trafik pada satu modul tidak menjatuhkan keseluruhan sistem.',
    approach:
      'Merancang empat layanan terpisah di jaringan kontainer Docker dengan kombinasi tiga mekanisme komunikasi: REST API di gerbang utama, gRPC untuk pengecekan kursi berlatensi rendah, dan RabbitMQ sebagai message broker penerbitan tiket secara asinkron.',
    result:
      'Komunikasi antar-layanan berjalan terisolasi, tahan lonjakan antrean tiket, dan mudah diuji secara independen di lingkungan kontainer.',
    repoUrl: PORTFOLIO_LINKS.shuttleRepo,
  },
  {
    id: 'swasembada',
    code: 'CASE-03',
    title: 'SWASEMBADAAI (Sistem Klasifikasi Swasembada Pangan)',
    tags: ['PHP', 'Alpine.js', 'Chart.js', 'Random Forest', 'SVM', 'CRISP-DM'],
    context:
      'Pemetaan status ketahanan pangan wilayah (Surplus, Seimbang, Defisit) membutuhkan pengolahan multi-indikator agronomi, iklim, dan distribusi agar mudah dianalisis secara visual.',
    approach:
      'Membangun platform web prototipe riset berbasis PHP, Tailwind CSS, Alpine.js, dan Chart.js mengikuti alur CRISP-DM. Menyajikan simulasi klasifikasi 11 indikator wilayah Jawa Barat dengan perbandingan model Random Forest dan SVM, peta regional, serta evaluasi model.',
    result:
      'Menghadirkan antarmuka analisis klasifikasi swasembada pangan terstruktur untuk empat wilayah studi kasus Jawa Barat (Karawang, Indramayu, Sumedang, Kota Bandung) dengan visualisasi performa model yang transparan.',
    repoUrl: PORTFOLIO_LINKS.swasembadaRepo,
  },
];

export interface CompetencyColumn {
  index: string;
  title: string;
  items: string[];
}

export const COMPETENCY_COLUMNS: CompetencyColumn[] = [
  {
    index: '01',
    title: 'Jaringan & Protokol',
    items: [
      'Pemrograman Socket TCP/IP',
      'REST API',
      'gRPC',
      'Message Broker (RabbitMQ)',
      'Konfigurasi DNS & Routing Dasar',
      'Analisis Alur Client-Server',
    ],
  },
  {
    index: '02',
    title: 'Sistem & Infrastruktur',
    items: [
      'Administrasi Linux (Ubuntu/Xubuntu)',
      'Docker & Jaringan Kontainer',
      'Git & GitHub Workflow',
      'ADB & Troubleshooting Sistem/Partisi',
    ],
  },
  {
    index: '03',
    title: 'Bahasa & Basis Data',
    items: [
      'Python',
      'TypeScript / Node.js',
      'PHP',
      'Dart (Flutter)',
      'SQL (MySQL, Oracle)',
      'MongoDB',
    ],
  },
];

export interface LabEntry {
  id: string;
  title: string;
  description: string;
  access: { label: string; url?: string };
}

export const LAB_ENTRIES: LabEntry[] = [
  {
    id: 'LAB-01',
    title: 'Eksplorasi Sistem Linux & Jaringan Lokal',
    description:
      'Pengelolaan dual-boot Windows/Linux, konfigurasi routing & DNS, pemulihan sistem via Live USB, serta eksperimen container Android (Waydroid).',
    access: { label: 'Dokumentasi Lokal' },
  },
  {
    id: 'PRJ-04',
    title: 'BimCheck (Sistem Antrean & Validasi Kehadiran QR)',
    description:
      'Aplikasi web untuk manajemen antrean bimbingan akademik dan validasi kehadiran berbasis QR Code dengan pendekatan SDLC terstruktur.',
    access: { label: 'GitHub', url: PORTFOLIO_LINKS.bimcheckRepo },
  },
];
