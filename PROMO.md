# Ordi: Bahan Flow & Materi Promo

File ini bahan untuk bikin video promo, deck jualan, atau caption. Isinya alur yang dilihat orang dan manfaat yang bisa diomongkan, bukan letak kode. Untuk sisi teknis, lihat `CLAUDE.md`. Untuk setup dan deploy, lihat `README.md`.

---

## 1. Ordi itu apa, dalam satu kalimat

Website pemesanan sendiri untuk UMKM F&B: pelanggan pesan lewat katalog, bayar QRIS, dan lacak pesanannya sendiri, sementara pemilik toko lihat semuanya dari satu dashboard.

Versi tiga kalimat, untuk pembuka video:

> Jualan makanan lewat chat itu capek. Stok ditanya berkali-kali, alamat bolak-balik, rekap pesanan dihitung manual tiap malam. Ordi memindahkan semua itu ke satu halaman yang bisa dibagikan linknya.

Yang bikin beda dan layak disebut di video:

- **Tidak ada biaya per transaksi.** QRIS digenerate sendiri di browser, bukan lewat payment gateway. Toko tidak kehilangan potongan tiap pesanan.
- **Bukan marketplace.** Tidak ada kompetitor di sebelah produk, tidak ada komisi, linknya milik toko sendiri.
- **Dipakai dari HP.** Semua layar, termasuk dashboard admin, dirancang untuk layar kecil.
- **Bisa untuk toko harian maupun toko PO.** Mesinnya sama, yang berubah cuma kalendernya.

---

## 2. Alur pelanggan, layar per layar

Ini urutan yang paling enak dijadikan storyboard. Satu layar satu shot.

### Layar 1: Cara ambil dan tanggal
Pelanggan buka link, langsung disambut dua pilihan besar: **Ambil Sendiri** atau **Diantar**. Di bawahnya deretan tanggal.

Yang menarik untuk disorot di video:
- Tanggal yang tokonya libur tertulis **"Libur"** dan tidak bisa ditekan.
- Tanggal yang kuotanya sudah habis tertulis **"Penuh"**.
- Pelanggan tahu duluan tanggal mana yang bisa, sebelum susah payah pilih menu.

Untuk toko PO, layar ini yang berubah: hari ini tidak ditawarkan sama sekali, paling cepat sesuai tenggang yang diatur toko (misal H-2).

### Layar 2: Katalog
Foto produk, harga, tombol tambah. Produk bervarian membuka sheet pilihan (ukuran, level pedas, apa saja yang diatur toko).

Yang menarik untuk disorot:
- Produk habis dapat badge **"Habis"** dan tombolnya mati, jadi tidak ada lagi chat "kak ini masih ada?".
- Produk berkuota menampilkan **"Sisa 4 slot"**, dan angkanya turun sendiri waktu keranjang diisi. Ini pemicu urgensi yang jujur, bukan hitung mundur palsu.
- Keranjang nempel di bawah layar dan bisa ditarik ke atas untuk lihat rinciannya.

### Layar 3: Checkout
Kartu profil (nama, WhatsApp, alamat), kode promo, catatan, total.

Yang menarik untuk disorot:
- **Pilih alamat lewat peta**, bukan ketik manual. Pelanggan cari nama tempat, hasilnya diurutkan dari yang paling dekat toko dan tiap hasil ditulis "2.4 km dari toko".
- **Ongkir muncul otomatis** begitu alamat disimpan, beberapa pilihan kurir dengan harganya, bukan angka karangan.
- Kalau alamatnya di luar jangkauan, pelanggan diberi tahu di sini, bukan setelah bayar.
- Data profil diingat untuk kunjungan berikutnya, jadi pelanggan langganan tinggal pilih menu dan bayar.

### Layar 4: Bayar QRIS
QR muncul di layar, nominalnya sudah terisi persis sesuai total. Pelanggan scan dari aplikasi bank atau e-wallet mana saja.

Yang menarik untuk disorot:
- Nominal sudah tertulis, tidak ada salah ketik jumlah.
- QR tidak punya masa berlaku, bisa dibuka lagi kapan saja dari ringkasan pesanan.
- Setelah bayar, satu tombol untuk kirim bukti transfer lewat WhatsApp dengan pesan yang sudah tersusun rapi.

### Layar 5: Ringkasan dan kode pesanan
Kode pesanan, rincian item, alamat pengantaran atau alamat toko untuk pickup, dan link untuk melacak.

### Layar 6: Lacak pesanan
Halaman terpisah (`/tracking/`). Pelanggan masukkan kode pesanan dan nomor WhatsApp, lalu lihat statusnya sendiri: Menunggu Konfirmasi, Diproses, Selesai.

Ini poin jualan yang sering diremehkan: **pelanggan berhenti bertanya "pesanan saya gimana kak"**, karena bisa cek sendiri kapan saja.

---

## 3. Alur pemilik toko

Dashboard admin punya lima tab. Semua bisa dibuka dari HP.

### Dashboard
Angka hari ini: pendapatan, jumlah pesanan, item terjual, omset bulan berjalan, dan jumlah pengunjung. Ada grafik batang tujuh hari terakhir dan daftar produk terlaris bulan ini.

Dua kartu di paling kiri menjawab pertanyaan dapur, bukan pertanyaan uang: **"Harus siap hari ini"** dan **"Harus siap besok"**. Ditekan, langsung lompat ke daftar pesanan tanggal itu. Ini shot yang bagus untuk video: satu ketukan dari angka ke daftar kerjaan.

### Pesanan
Daftar pesanan, difilter per status (Menunggu, Diproses, Selesai, Dibatalkan) dan per tanggal.

Yang menarik untuk disorot:
- **Rekap produksi.** Pilih satu tanggal, langsung muncul "tanggal ini bikin apa, berapa": total per produk, dipecah per varian, urut dari yang paling banyak. Ini yang biasanya dihitung manual sambil scroll chat.
- **Print label sekaligus.** Satu tombol cetak semua label untuk daftar yang sedang difilter, jumlahnya tertulis di tombolnya.
- **Export CSV** untuk pembukuan.
- **Notifikasi pesanan masuk**: toast, bunyi, dan badge angka di tab Pesanan, langsung saat pesanan masuk tanpa perlu refresh.
- Tombol WhatsApp ke pelanggan dengan ringkasan pesanan yang sudah terisi.

### Produk
Tambah dan ubah produk, foto, harga, varian, stok, dan kuota harian. Ada juga import CSV untuk toko yang mau pindah menu sekaligus banyak.

Dua angka yang beda dan enak dijelaskan di video:
- **Stok**: jumlah barang yang ada, berkurang permanen. Cocok untuk barang jadi.
- **Kuota harian**: berapa banyak yang sanggup dibuat untuk satu tanggal, penuh lagi besoknya. Cocok untuk toko yang batasnya tenaga, bukan bahan.

### Promo
Kode promo, potongan persen atau nominal, minimal belanja, tanggal kedaluwarsa.

### Pengaturan
Nama toko, logo, favicon, alamat, jam buka, banner, link Instagram dan TikTok, cara pesan (toko harian atau PO, tenggang, berapa hari ke depan yang dibuka), dan **tanggal libur**.

Tanggal libur ini poin bagus untuk video: toko tinggal tandai tanggalnya, dan tanggal itu langsung mati di kalender pelanggan.

---

## 4. Angle cerita yang bisa dipakai

Pilih satu per video, jangan digabung semua.

| Angle | Kalimat pembuka | Ditutup dengan |
|---|---|---|
| Capek balas chat | "Sehari berapa kali kamu ngetik 'masih ada kak'?" | Katalog yang stoknya update sendiri |
| Salah hitung pesanan | "Pernah kelebihan terima pesanan sampai kewalahan?" | Kuota harian dan rekap produksi |
| Potongan marketplace | "Tiap pesanan dipotong berapa persen?" | QRIS tanpa biaya transaksi |
| Toko PO | "Buka PO tiap minggu tapi rekapnya masih di notes?" | Kalender PO dan rekap per tanggal |
| Pelanggan nanya terus | "Pesanan saya gimana kak?" | Halaman lacak pesanan |

### Tiga demo 15 detik yang paling kuat
1. Isi keranjang, angka "Sisa slot" turun di depan mata, lalu tanggal lain dipilih dan slotnya penuh lagi.
2. Pilih tanggal di dashboard, rekap produksi muncul, tombol print label ditekan.
3. Scan QRIS dari HP kedua, nominalnya sudah terisi.

---

## 5. Paket

Semua paket dapat katalog, keranjang, pilih tanggal, dashboard admin lengkap, lacak pesanan, stok, dan kuota harian. Bedanya di cara bayar dan antar.

| | Basic | Antar | Bayar |
|---|---|---|---|
| Katalog dan pesanan | ya | ya | ya |
| Dashboard admin | ya | ya | ya |
| Lacak pesanan | ya | ya | ya |
| Stok dan kuota harian | ya | ya | ya |
| Checkout lanjut ke WhatsApp | ya | ya | ya |
| Pilih alamat lewat peta | tidak | ya | ya |
| Hitung ongkir otomatis | tidak | ya | ya |
| Bayar QRIS di halaman | tidak | tidak | ya |

Cara menjelaskan di video: Basic untuk toko yang pelanggannya ambil sendiri, Antar untuk yang pakai kurir, Bayar untuk yang mau pelanggan bayar duluan tanpa tanya nomor rekening.

---

## 6. Yang jangan dijanjikan di video

Supaya materi promo tidak menjanjikan hal yang belum ada:

- Pembayaran **tidak** terverifikasi otomatis. Pemilik toko tetap melihat bukti transfer di WhatsApp lalu menekan Konfirmasi. Sebut ini sebagai "kamu tetap pegang kendali", jangan sebut "otomatis masuk".
- Notifikasi pesanan masuk muncul **selama dashboard terbuka**, bukan push notification ke HP yang tertutup.
- Belum ada uang muka atau DP. Pembayaran penuh di muka.
- Belum ada kuota per produk per tanggal yang berbeda beda, kuotanya satu angka per produk.
- Ongkir memakai kurir instan untuk pengantaran hari itu, bukan pengiriman antarkota.
