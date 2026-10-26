export function adviceFor(level, kind, stats) {
  const bad = stats.malicious || 0, sus = stats.suspicious || 0
  const isUrl = kind === 'url', thing = isUrl ? 'link' : 'file'
  const total = bad + sus + (stats.harmless || 0) + (stats.undetected || 0)
  const count = level === 'safe'
    ? `Dari ${total} pemeriksa keamanan, tidak satu pun menemukan masalah.`
    : `Dari ${total} pemeriksa keamanan: ${bad} menyatakan berbahaya, ${sus} menandai mencurigakan.`
  const A = {
    safe: {
      icon: '✅',
      meaning: isUrl
        ? 'Link ini tidak dikenali sebagai situs penipuan (phishing), penyebar virus, atau situs berbahaya lainnya.'
        : 'File ini tidak mengandung virus atau program jahat yang dikenali oleh para pemeriksa keamanan.',
      tips: isUrl ? [
        'Cek ejaan alamat di bilah browser. Penipu sering memakai alamat yang mirip situs resmi.',
        'Tetap jangan memasukkan password, PIN, atau kode OTP kecuali Anda yakin itu situs resmi.',
        'Hasil aman bukan jaminan 100%. Situs bisa berubah isinya sewaktu-waktu.'
      ] : [
        'Pastikan file berasal dari sumber yang Anda percaya.',
        'Waspadai nama file yang aneh, misalnya foto.jpg.exe. Itu bukan foto, melainkan program.',
        'Biarkan antivirus di perangkat Anda tetap aktif sebagai perlindungan tambahan.'
      ]
    },
    warn: {
      icon: '⚠️',
      meaning: bad > 0
        ? `Sebagian kecil pemeriksa menandai ${thing} ini. Bisa jadi itu salah deteksi (alarm palsu), tetapi bisa juga ancaman baru yang belum banyak dikenali. Karena belum pasti, lebih baik berhati-hati.`
        : `Ada ciri pada ${thing} ini yang mirip penipuan atau program berbahaya, meski belum terbukti. Karena belum pasti, lebih baik berhati-hati.`,
      tips: isUrl ? [
        'Jangan dibuka dulu. Jika link dikirim orang, tanyakan ke pengirimnya lewat telepon atau chat resmi.',
        'Jika sudah terlanjur dibuka, jangan isi password, data bank, atau kode OTP, dan jangan unduh apa pun.',
        'Untuk situs yang Anda butuhkan, ketik alamat resminya sendiri atau cari lewat mesin pencari.',
        'Coba periksa lagi beberapa jam kemudian. Hasil bisa berubah.'
      ] : [
        'Jangan dibuka atau dijalankan dulu.',
        'Unduh ulang dari situs resmi pembuatnya, lalu periksa lagi di sini.',
        'Jika file ini tetap harus dipakai, pindai juga dengan antivirus di perangkat Anda dan jangan buka di perangkat yang menyimpan data penting.'
      ]
    },
    danger: {
      icon: '🚫',
      meaning: isUrl
        ? 'Banyak pemeriksa sepakat link ini berbahaya. Link seperti ini biasanya dipakai untuk menipu (mencuri password, data bank, atau kode OTP) atau menyebarkan virus.'
        : 'Banyak pemeriksa sepakat file ini berbahaya. Virus bisa merusak perangkat, mengunci file Anda, atau mencuri data pribadi.',
      tips: isUrl ? [
        'Jangan buka link ini dan jangan bagikan ke orang lain.',
        'Jika sudah terlanjur dibuka lalu Anda mengisi password, segera ganti password akun itu.',
        'Jika sudah memasukkan data bank, kartu, atau kode OTP, segera hubungi bank Anda.',
        'Hapus pesan yang berisi link tersebut. Pengirimnya mungkin akunnya diretas.'
      ] : [
        'Jangan buka atau jalankan file ini. Hapus dari perangkat, termasuk dari tempat sampah.',
        'Jika sudah terlanjur dibuka, putuskan internet lalu jalankan pemindaian penuh dengan antivirus.',
        'Ganti password penting (email, bank, media sosial) dari perangkat lain yang bersih.',
        'Hati-hati dengan pengirim file ini. Akunnya mungkin diretas.'
      ]
    }
  }[level]
  return { meaning: A.meaning, count, tips: A.tips, icon: A.icon }
}
