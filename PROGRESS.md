# 📊 Status Refactoring Riksa Heula (Vue 3)

## Ringkasan Proyek
Refactor satu file monolitik legacy (`legacy/index.backup.html`, 873 baris, vanilla JS + Tailwind CDN) menjadi proyek modern berbasis **Vue 3 + Vite + Tailwind CSS v3** dengan Composition API (`<script setup>`), tanpa mengubah tampilan piksel demi piksel maupun logika bisnis.

---

## Modul & Komponen yang Telah Selesai

### 1. Konfigurasi & Fondasi
- [x] `package.json` – Vue 3, Vite, Tailwind CSS v3.4, PostCSS, Autoprefixer, jsQR, html2canvas (tanpa Pinia / Router).
- [x] `vite.config.js` – Setup plugin Vue.
- [x] `tailwind.config.js` – Konfigurasi utility Tailwind v3 dengan font Plus Jakarta Sans.
- [x] `postcss.config.js` – PostCSS loader untuk Tailwind dan Autoprefixer.
- [x] `index.html` – Anti-flicker theme script di `<head>` dan Google Fonts Plus Jakarta Sans.
- [x] `src/assets/styles.css` – Seluruh styling kustom disalin verbatim (.card, .neo, .neo-in, .tab-ind, animasi, @media print, dark mode, dll).
- [x] `.env.example` & `.gitignore` – Konfigurasi keamanan API key.

### 2. Data Murni (`src/data/`)
- [x] `quiz.js` – 5 set soal kuis edukasi penipuan.
- [x] `brands.js` – 17 daftar merek resmi Indonesia (BCA, Mandiri, Shopee, dll).
- [x] `issuers.js` – Daftar issuer QRIS dan kriteria EMVCo.
- [x] `advice.js` – Fungsi murni `adviceFor(level, kind, stats)` yang mengembalikan objek data `{ meaning, count, tips, icon }`.

### 3. Utility (`src/utils/`)
- [x] `interpret.js` – `interpret(stats)` & data tampilan `LOOK` (aman, peringatan, bahaya).
- [x] `loadLib.js` – Pemuat dinamis (lazy import) untuk `jsqr` dan `html2canvas`.

### 4. Composables (`src/composables/`)
- [x] `useTheme.js` – Reaktif tema terang/gelap (☀️ / 🌙), sinkronisasi ke `localStorage` dan atribut `html[data-theme]`.
- [x] `useVirusTotal.js` – Integrasi VirusTotal v3 API, polling `waitAnalysis()` maks 20x dengan exponential wait & 429 retry, hashing SHA-256 via Web Crypto API.
- [x] `useLinkInfo.js` – Deteksi 21 pemendek tautan, resolusi DNS via Google DNS over HTTPS, reverse IP lookup via ipwho.is, pelacakan redirect dan komparasi hasil terburuk (`worse()`).
- [x] `useBrandCheck.js` – Levenshtein distance dan deteksi peniru merek (typosquatting & token spoofing).
- [x] `useQris.js` – Parser EMVCo TLV dan validasi CRC16 untuk QRIS.
- [x] `useQrScanner.js` – Pemindaian foto QR via Canvas + jsQR dan streaming kamera dengan WebRTC (`getUserMedia`).
- [x] `useSpeech.js` – Suara sintetis (`speechSynthesis`) berbahasa Indonesia.
- [x] `useShare.js` – Tautan bagikan ke WhatsApp (dengan sanitasi `hxxp` dan `[.]` untuk link berbahaya), rendering kartu html2canvas, dan window.print PDF.
- [x] `useCheckFlow.js` – State machine orchestrator (`idle`, `loading`, `error`, `qris`, `result`).

### 5. Komponen Vue (`src/components/` & `App.vue`)
- [x] `App.vue` – Komponen induk yang menyediakan state `checkFlow` dan menyusun layout utama.
- [x] `AppHeader.vue` – Header judul gradien, badge VirusTotal beranimasi shine & dot pulse.
- [x] `ThemeToggle.vue` – Tombol pergantian tema dengan efek rotasi & transisi halus.
- [x] `TabSwitcher.vue` – Tab navigasi 4 mode dengan sliding indicator (.tab-ind) berbasis translateX.
- [x] `DropZone.vue` – Komponen reusable drag-and-drop dengan border animasi marching dash.
- [x] `UrlPane.vue` – Input URL dengan tombol "Periksa Sekarang" dan keyboard enter support.
- [x] `FilePane.vue` – Unggah berkas maks 32 MB, tampilan badge nama file, dan tombol ganti file.
- [x] `QrPane.vue` – Unggah gambar QR atau pemindai kamera interaktif.
- [x] `QuizPane.vue` – Permainan interaktif kuis 5 soal dengan skor dan tombol bagikan WhatsApp (tanpa `v-html`).
- [x] `LoadingCard.vue` – Status pemindaian dengan spinner emoji 🔍 dan pesan dinamis.
- [x] `ErrorCard.vue` – Kartu peringatan kendala ramah pengguna.
- [x] `QrisCard.vue` – Visualisasi data merchant QRIS, status format, dan rincian transaksi.
- [x] `ResultCard.vue` – Kontainer hasil pemindaian lengkap.
- [x] `GaugeMeter.vue` – Gauge SVG interaktif dengan animasi jarum (double requestAnimationFrame) dan counter angka naik.
- [x] `BrandWarning.vue` – Kotak peringatan merah saat terdeteksi alamat tiruan merek.
- [x] `InfoPanel.vue` – Rincian link, deteksi pemendek url, dan bendera lokasi server.
- [x] `AdviceList.vue` – Penjelasan awam "Apa artinya?" dan rekomendasi tindakan aman.
- [x] `ResultActions.vue` – 5 tombol aksi: suara hasil, bagikan WA, kartu gambar, simpan PDF, dan periksa yang lain.
- [x] `ShareCard.vue` – Kartu off-screen tersembunyi yang dirender menjadi gambar PNG.
- [x] `AppFooter.vue` – 3 pilar fitur keamanan dan link resmi instansi terkait (bukan modal/iframe).

---

## Status Verifikasi Build
- **`npm run build`**: Berhasil tanpa error dan tanpa warning.
- **Lazy Loading**: `jsQR` dan `html2canvas` terpisah menjadi chunk mandiri dan hanya diunduh saat dibutuhkan.
