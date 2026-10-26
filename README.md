# 🛡️ Riksa Heula (Vue 3 Edition)

Web pemeriksa keamanan file dan tautan untuk masyarakat awam berbahasa Indonesia, didukung oleh VirusTotal v3 API. Proyek ini merupakan hasil refaktor modern dari legacy vanilla HTML menjadi arsitektur **Vue 3 + Vite + Tailwind CSS v3**.

---

## 🚀 Fitur Utama

1. **🔗 Cek Link**:
   - Pengecekan reputasi alamat URL melalui VirusTotal v3.
   - Deteksi otomatis 21 pemendek tautan (bit.ly, s.id, tinyurl, dll) dan pemeriksaan terhadap URL tujuan akhir.
   - Geolocation server & flag via DNS Google (`dns.google`) dan `ipwho.is`.
   - Deteksi domain peniru merek terkemuka (BCA, Mandiri, Shopee, Tokopedia, dll) memakai token matching dan Levenshtein distance.
2. **📄 Cek File**:
   - Drag & drop berkas interaktif dengan animasi marching dashed border (maks 32 MB).
   - Pra-pemeriksaan hash SHA-256 lokal menggunakan Web Crypto API: bila hash sudah ada di database VirusTotal, hasil instan tanpa harus mengunggah ulang.
3. **📷 Scan QR & QRIS**:
   - Pemindaian gambar QR lokal atau streaming kamera perangkat via `jsQR` (lazy-loaded).
   - Deteksi QR link otomatis diarahkan ke Cek Link.
   - Parser QRIS (EMVCo TLV + validasi CRC16) untuk menampilkan identitas merchant, NMID, dan skala usaha.
4. **🎮 Kuis Edukasi**:
   - Kuis 5 skenario mengenali modus penipuan online dengan umpan balik instan dan skor yang dapat dibagikan ke WhatsApp.
5. **Aksi & Laporan**:
   - Animasi meteran keamanan (Gauge) dan penomoran dinamis.
   - Suara pembaca hasil ramah tuna netra (`speechSynthesis`).
   - Ekspor laporan cetak / PDF terformat (`window.print()`).
   - Unduh kartu gambar PNG via `html2canvas` (lazy-loaded).
   - Mode Terang / Gelap dengan transisi halus dan anti-kedip saat muat awal.

---

## 🛠️ Stack Teknologi

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3.4](https://tailwindcss.com/) + PostCSS + CSS Kustom Neumorphism
- **Font**: Plus Jakarta Sans (Google Fonts)
- **Pustaka Tambahan (Lazy-loaded)**:
  - `jsqr` (~130 kB) – dipanggil hanya saat fitur Scan QR digunakan.
  - `html2canvas` (~201 kB) – dipanggil hanya saat tombol "Bagikan Gambar Kartu" ditekan.

---

## 📂 Struktur Direktori

```
riksa-heula-vue/
├── index.html                  # File HTML utama + skrip inisialisasi tema
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example                # Templat variabel lingkungan
├── legacy/
│   └── index.backup.html       # File aplikasi monolitik terdahulu
└── src/
    ├── main.js                 # Titik masuk Vue
    ├── App.vue                 # Komponen orkestrator utama
    ├── assets/
    │   └── styles.css          # Semua CSS kustom & animasi
    ├── components/
    │   ├── AppHeader.vue       # Header aplikasi + judul + badge
    │   ├── ThemeToggle.vue     # Tombol toggle dark/light mode
    │   ├── TabSwitcher.vue     # Tab 4 mode dengan sliding indicator
    │   ├── UrlPane.vue         # Form input pengecekan URL
    │   ├── FilePane.vue        # Area unggah file
    │   ├── QrPane.vue          # Area pemindaian QR / kamera
    │   ├── QuizPane.vue        # Tampilan kuis interaktif
    │   ├── DropZone.vue        # Komponen dropzone reusable
    │   ├── LoadingCard.vue     # Status loading & progress
    │   ├── ErrorCard.vue       # Notifikasi kesalahan
    │   ├── QrisCard.vue        # Kartu informasi rincian QRIS
    │   ├── ResultCard.vue      # Kontainer hasil pemeriksaan
    │   ├── GaugeMeter.vue      # Meteran SVG + animasi jarum
    │   ├── BrandWarning.vue    # Peringatan domain tiruan merek
    │   ├── InfoPanel.vue       # Info link & lokasi server
    │   ├── AdviceList.vue      # Penjelasan awam & saran keamanan
    │   ├── ResultActions.vue   # Tombol aksi (Suara, WA, Gambar, PDF)
    │   ├── ShareCard.vue       # Elemen kartu off-screen untuk gambar
    │   └── AppFooter.vue       # Informasi privasi & tautan resmi eksternal
    ├── composables/
    │   ├── useTheme.js         # Pengelolaan tema & penyimpanan lokal
    │   ├── useVirusTotal.js    # Komunikasi API VirusTotal v3
    │   ├── useLinkInfo.js      # Deteksi redirect & info tautan
    │   ├── useBrandCheck.js    # Algoritma pemeriksa merek
    │   ├── useQris.js          # Parser TLV & CRC16 QRIS
    │   ├── useQrScanner.js     # Integrasi kamera & pembaca gambar
    │   ├── useSpeech.js        # Web Speech Synthesis
    │   ├── useShare.js         # Generator tautan WA & ekspor gambar
    │   └── useCheckFlow.js     # State machine alur pemeriksaan
    ├── data/
    │   ├── quiz.js             # Soal kuis edukatif
    │   ├── brands.js           # Basis data merek
    │   ├── advice.js           # Pembuat saran keamanan murni
    │   └── issuers.js          # Basis data bank/penerbit QRIS
    └── utils/
        ├── interpret.js        # Klasifikasi skor & status bahaya
        └── loadLib.js          # Dynamic loader pustaka berat
```

---

## 🔒 Catatan Keamanan Penting

1. **Variabel Lingkungan di Sisi Klien**:
   - Variabel yang diawali dengan `VITE_` (seperti `VITE_VT_API_KEY`) akan disertakan ke dalam bundel JavaScript publik dan **dapat dilihat oleh siapa saja** melalui Developer Tools browser.
2. **Rekomendasi Lingkungan Produksi**:
   - Untuk lingkungan produksi yang aman, sangat disarankan untuk mengatur server proxy atau serverless function (misal: Cloudflare Workers, Vercel Serverless, atau Express.js) sebagai perantara pemanggilan API VirusTotal.
   - Ubah `VITE_API_BASE` pada file `.env` mengarah ke alamat server perantara Anda (misal: `https://api.domain-anda.com/vt`) dan simpan API key rahasia di server backend.

---

## 🚀 Cara Menjalankan Proyek

### 1. Prasyarat
- [Node.js](https://nodejs.org/) v18 atau yang lebih baru.
- npm atau pnpm / yarn.

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi `VITE_VT_API_KEY` dengan kunci API VirusTotal v3 Anda (dapat diperoleh gratis di [VirusTotal](https://www.virustotal.com/)):
```env
VITE_VT_API_KEY=kunci_api_virustotal_anda
VITE_API_BASE=https://www.virustotal.com/api/v3
```

### 4. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Buka browser pada alamat yang tertera (biasanya `http://localhost:5173`).

### 5. Membangun untuk Produksi (Production Build)
```bash
npm run build
```
File hasil build akan berada di direktori `dist/`. Anda dapat mengujinya dengan:
```bash
npm run preview
```
