# Panduan Ordi

Panduan pemakaian Ordi untuk pemilik toko dan siapa pun yang memegang dashboard admin. Isinya cara memakai, bukan cara memasang. Untuk setup Supabase, env var, dan deploy, lihat `README.md`. Untuk letak kode, lihat `CLAUDE.md`.

---

## Sebelum mulai: versi mana yang kamu pakai

Panduan ini ditulis dari versi lengkap Ordi. Toko yang memakai paket lebih kecil tidak akan melihat sebagian layar:

| | Basic | Antar | Bayar |
|---|---|---|---|
| Katalog, keranjang, pilih tanggal | ya | ya | ya |
| Dashboard admin lengkap | ya | ya | ya |
| Lacak pesanan | ya | ya | ya |
| Stok, kuota harian, tanggal libur | ya | ya | ya |
| Pilih alamat lewat peta + ongkir otomatis | tidak | ya | ya |
| Bayar QRIS di halaman | tidak | tidak | ya |

Kalau toko kamu di paket Basic atau Antar, lewati bagian yang menyebut QRIS atau ongkir. Sisanya sama.

---

## 1. Tiga alamat yang perlu kamu tahu

Satu toko punya tiga halaman. Ganti `tokokamu.com` dengan alamat website toko kamu.

| Alamat | Untuk siapa | Isinya |
|---|---|---|
| `tokokamu.com` | Pelanggan | Katalog dan pemesanan. Link ini yang kamu bagikan. |
| `tokokamu.com/admin/` | Kamu | Dashboard admin, butuh login. Jangan dibagikan. |
| `tokokamu.com/tracking/` | Pelanggan | Lacak pesanan pakai kode pesanan + nomor WhatsApp. |

Semua halaman dirancang untuk dibuka dari HP, termasuk dashboard admin.

---

## 2. Hari pertama: urutan setup

Kerjakan berurutan. Urutannya penting karena katalog pelanggan membaca semua isian ini.

1. **Login** ke `/admin/` dengan email dan password yang diberikan tim Ordi.
2. **Pengaturan > Brand**: isi nama toko, upload logo ikon, logo teks (opsional), dan favicon.
3. **Pengaturan > Informasi Toko**: alamat pickup, jam operasional, link Google Maps.
4. **Pengaturan > Cara Pesan**: pilih mode toko (lihat bagian 6.5). Ini keputusan paling berpengaruh di seluruh setup.
5. **Pengaturan > Tanggal Libur**: masukkan tanggal yang sudah pasti tutup.
6. Tekan **Simpan Pengaturan** di paling bawah. Tanggal libur tersimpan langsung saat ditambah, tapi isian lain baru tersimpan lewat tombol ini.
7. **Produk**: tambahkan menu, satu per satu atau lewat Import CSV.
8. **Promo**: opsional, buat kode promo pembuka kalau ada.
9. **Coba pesan sendiri** dari HP lain atau jendela samaran, sampai ke layar ringkasan pesanan. Lalu cek pesanannya muncul di tab Pesanan, dan batalkan supaya stoknya kembali.
10. Bagikan link `tokokamu.com` ke pelanggan.

Langkah 9 jangan dilewati. Itu satu-satunya cara memastikan nomor WhatsApp toko, QRIS, dan alamat toko sudah benar sebelum pelanggan sungguhan memakainya.

---

## 3. Alur pelanggan

Kamu perlu paham ini supaya bisa membantu pelanggan yang bingung. Ada tiga langkah, lalu pembayaran.

### Langkah 1: cara ambil dan tanggal
Pelanggan memilih **Pickup** (ambil sendiri) atau **Delivery** (dikirim), lalu memilih tanggal.

- Tanggal yang kamu tutup tertulis **Libur** dan tidak bisa ditekan.
- Tanggal yang kuotanya sudah habis tertulis **Penuh**.
- Kalau semua tanggal terdekat tidak bisa dipesan, kalender diganti satu kalimat penjelasan.
- Di bawahnya ada link **Lacak Pesanan**.

### Langkah 2: katalog
Pelanggan memilih menu. Produk bervarian membuka pilihan (misal ukuran atau level pedas) sebelum masuk keranjang.

- **Habis**: stok produk itu 0. Tidak bisa dipesan di tanggal mana pun.
- **Penuh**: kuota produk itu untuk tanggal terpilih sudah habis. Tanggal lain mungkin masih bisa.
- **Sisa N slot**: sisa kuota tanggal itu. Angkanya turun saat pelanggan mengisi keranjang.
- Bar keranjang di bawah layar bisa ditekan untuk melihat rinciannya.

### Langkah 3: checkout
- **Info Pemesan**: nama dan nomor WhatsApp. Untuk Delivery, ditambah alamat.
- **Alamat** dipilih lewat pencarian lalu dikonfirmasi di peta. Hasil pencarian diurutkan dari yang paling dekat toko dan tiap hasil menulis jaraknya dari toko.
- **Ongkir** muncul otomatis setelah alamat disimpan. Kalau alamat di luar jangkauan, pelanggan diberi tahu di sini dan tidak bisa lanjut bayar.
- **Kode Promo** dan **Catatan** opsional.
- Nama, WhatsApp, dan alamat diingat di HP pelanggan untuk kunjungan berikutnya. Keranjang dan tanggal tidak, selalu mulai kosong.

### Pembayaran QRIS
1. Pelanggan menekan **Bayar via QRIS**. QR muncul dengan nominal yang sudah pas.
2. Pelanggan scan dari aplikasi bank atau e-wallet mana saja, bayar, lalu menekan **Konfirmasi Pesanan**.
3. Baru di titik ini pesanan tercatat di sistem, dengan status **Menunggu**.
4. Layar ringkasan muncul dengan kode pesanan dan tombol **Kirim Bukti Transfer via WhatsApp**, yang membuka chat ke nomor toko dengan pesan yang sudah tersusun.
5. Ada tombol **Tampilkan QR lagi** kalau pelanggan perlu scan ulang.

Penting dipahami: **sistem tidak tahu apakah pelanggan benar-benar sudah bayar.** Status Menunggu artinya pelanggan mengaku sudah bayar. Yang memverifikasi itu kamu, dari bukti transfer dan mutasi rekening.

### Lacak pesanan
Di `/tracking/`, pelanggan memasukkan kode pesanan dan nomor WhatsApp yang dipakai saat pesan. Statusnya: Menunggu Konfirmasi, Diproses, Selesai, atau Dibatalkan. Kalau kode atau nomornya salah, keluarnya "Pesanan tidak ditemukan" tanpa menyebut mana yang salah. Itu sengaja, supaya orang lain tidak bisa menebak-nebak pesanan orang.

---

## 4. Login admin

Buka `tokokamu.com/admin/`, masukkan email dan password, tekan **Masuk**.

- Tidak ada tombol daftar atau lupa password di halaman ini. Akun admin dibuat oleh tim Ordi. Kalau lupa password atau butuh akun admin tambahan untuk karyawan, hubungi tim Ordi.
- Semua admin punya akses penuh. Belum ada pembedaan peran (misal kasir hanya bisa lihat pesanan).

Dashboard punya lima tab: **Dashboard**, **Produk**, **Promo**, **Pesanan**, **Pengaturan**. Di HP, deretan tab bisa digeser ke samping.

---

## 5. Tab Dashboard

Tab yang terbuka pertama kali setelah login. Menjawab "apa yang perlu dikerjakan hari ini".

- **Menunggu konfirmasi kamu**: jumlah pesanan yang pelanggannya mengaku sudah bayar. Ini antrean kerja utama.
- **Harus siap hari ini** dan **Harus siap besok**: jumlah pesanan berdasarkan **tanggal ambil/kirim**, termasuk yang belum dikonfirmasi. Tekan kartunya untuk langsung membuka tab Pesanan dengan tanggal itu terpilih.
- **Pendapatan hari ini**, **Pesanan hari ini**, **Item terjual hari ini**, **Omset bulan ini**: berdasarkan **kapan pesanan masuk**, dan hanya menghitung pesanan Diproses dan Selesai.
- **Pengunjung hari ini**: jumlah kunjungan ke katalog (satu orang yang me-refresh berkali-kali tetap dihitung sekali), plus grafik 7 hari.
- Grafik pendapatan 7 hari, jumlah per status, dan produk terlaris bulan ini.

Kenapa "Harus siap hari ini" dan "Pesanan hari ini" angkanya bisa beda: yang pertama menghitung pesanan **untuk** hari ini (pertanyaan dapur), yang kedua menghitung pesanan yang **masuk** hari ini (pertanyaan uang). Untuk toko PO, keduanya bisa jauh berbeda, dan itu normal.

Kenapa pendapatan tidak menghitung pesanan Menunggu: uangnya belum kamu verifikasi.

---

## 6. Tab Pesanan

Tempat kerja harian. Judulnya **Pesanan Masuk**.

### 6.1 Rutinitas memproses pesanan

1. Pesanan baru masuk dengan status **Menunggu**.
2. Pelanggan mengirim bukti transfer ke WhatsApp toko.
3. Cocokkan nominal dan kode pesanan dengan mutasi rekening atau aplikasi QRIS kamu. **Jangan hanya percaya screenshot**, cek uangnya benar-benar masuk.
4. Tekan **Konfirmasi** (langsung dari daftar, atau dari dalam **Detail**). Status jadi **Diproses**.
5. Siapkan pesanannya. Untuk delivery, kirim lewat kurir.
6. Setelah pesanan diambil atau sampai, buka **Detail** lalu tekan **Selesai**.

Setiap perubahan status langsung terlihat oleh pelanggan di halaman Lacak Pesanan.

### 6.2 Filter

- **Filter status**: Menunggu (default), Diproses, Selesai, Dibatalkan, Semua.
- **Filter tanggal**: baris kedua, berisi tanggal yang punya pesanan beserta jumlahnya. Tanggal mendatang ditampilkan duluan, lalu tanggal yang sudah lewat. Tekan **Semua tanggal** untuk melepas.

### 6.3 Rekap produksi

Muncul saat satu tanggal dipilih. Isinya total tiap produk untuk tanggal itu, dipecah per varian, urut dari yang paling banyak. Ini jawaban "besok bikin apa saja, berapa".

Dua hal yang perlu diingat:
- Rekap **tidak ikut filter status**. Angkanya sama, mau kamu sedang di tab Menunggu atau Selesai.
- Rekap **menghitung pesanan Menunggu**, karena pesanan itu kemungkinan besar tetap harus dibuat. Yang tidak dihitung cuma yang Dibatalkan. Kalimat di bawah judul rekap menyebut berapa yang belum dikonfirmasi.

### 6.4 Detail pesanan

Tekan **Detail** pada satu pesanan untuk melihat nomor, nama, WhatsApp, tipe, tanggal, alamat, catatan, item, ongkir, diskon, dan total. Tombol yang tersedia tergantung status:

| Tombol | Muncul saat | Fungsinya |
|---|---|---|
| **Konfirmasi** | Menunggu | Ubah ke Diproses |
| **Selesai** | Diproses | Ubah ke Selesai |
| **Batalkan** | Menunggu atau Diproses | Ubah ke Dibatalkan, stok dikembalikan |
| **Print Label** | Selain Menunggu | Cetak label pesanan ini |
| **WA Customer** | Selalu (kalau ada nomor) | Buka chat ke pelanggan dengan ringkasan pesanan terisi |

**Hati-hati dengan Batalkan.** Tidak ada pertanyaan "yakin?", dan pesanan yang sudah dibatalkan tidak bisa dikembalikan ke status lain. Kalau salah tekan, pelanggan harus memesan ulang.

### 6.5 Print label sekaligus

Tombol **Print N Label** di atas daftar mencetak label untuk **semua pesanan yang sedang terfilter**, status dan tanggal. Angka N di tombol adalah jumlah halaman yang akan tercetak, jadi cek angkanya dulu.

Cara pakai yang paling umum: pilih filter **Diproses**, pilih tanggal besok, lalu **Print N Label**.

### 6.6 Export CSV

**Export CSV** mengunduh daftar yang sedang terfilter ke file yang bisa dibuka di Excel atau Google Sheets. Nama filenya ikut tanggal yang dipilih. Untuk laporan omset, filter **Selesai** dulu baru export.

### 6.7 Notifikasi pesanan baru

Selama dashboard terbuka, pesanan baru memunculkan pemberitahuan di layar, bunyi, dan angka di tab **Pesanan**. Angkanya hilang saat tab Pesanan dibuka.

Batasannya:
- **Hanya selama halaman admin terbuka.** Kalau browser ditutup atau HP terkunci lama, tidak ada notifikasi. Pesanan tetap tersimpan, hanya kamu tidak diberi tahu.
- Bunyi bisa tidak keluar kalau browser memblokir suara sebelum halaman pernah disentuh. Ketuk halaman sekali setelah membukanya.
- Andalan utama tetap chat WhatsApp bukti transfer dari pelanggan.

### 6.8 Pesanan Menunggu yang tidak pernah dibayar

Pesanan Menunggu yang berumur lebih dari 24 jam **disembunyikan dari daftar** dan slot kuotanya dilepas otomatis. Tapi **stoknya tidak kembali**, dan karena pesanannya sudah tidak terlihat, kamu tidak bisa membatalkannya lagi.

Aturan praktisnya: **pesanan Menunggu yang tidak mengirim bukti transfer dalam sehari, batalkan sendiri sebelum lewat 24 jam.** Kalau tidak, stok produk itu berkurang padahal tidak terjual, dan harus kamu koreksi manual lewat Edit produk.

---

## 7. Tab Produk

Judulnya **Daftar Produk**. Tiap produk menampilkan tag: Baru, Terlaris, Tampil atau Disembunyikan, dan status stok.

### 7.1 Tambah atau edit produk

Tekan **+ Tambah Produk**, atau **Edit** pada produk yang ada.

| Isian | Wajib | Keterangan |
|---|---|---|
| Nama Produk | ya | |
| Deskripsi | tidak | Bahan, ukuran, isi |
| Harga (Rp) | ya | Harga dasar, sebelum varian |
| Stok | tidak | Kosong = tidak dibatasi. Lihat 7.2 |
| Kuota per tanggal | tidak | Kosong = tidak dibatasi. Lihat 7.2 |
| Foto Produk | tidak | PNG, JPG, WEBP, maks 5 MB |
| Badge "Baru" / "Terlaris" | tidak | Label kecil di kartu produk |
| Tampilkan di Katalog | default nyala | Matikan untuk menyembunyikan |
| Varian Produk | tidak | Lihat 7.3 |

### 7.2 Stok vs kuota per tanggal

Dua angka yang berbeda dan bisa dipakai bersamaan.

| | Stok | Kuota per tanggal |
|---|---|---|
| Artinya | Berapa barang yang ada | Berapa yang sanggup dibuat untuk satu tanggal |
| Berkurang saat | Ada pesanan | Ada pesanan untuk tanggal itu |
| Terisi lagi | Hanya kalau kamu ubah, atau ada pesanan dibatalkan | Otomatis, tiap tanggal punya jatah sendiri |
| Cocok untuk | Barang jadi, stok terbatas | Makanan dibuat per pesanan, batasnya tenaga |
| Di katalog | "Habis" saat 0 | "Sisa N slot", lalu "Penuh" |

Contoh: kue yang tiap hari sanggup dibuat 20 loyang, isi **Kuota per tanggal = 20** dan kosongkan Stok. Minuman botol yang tersisa 48 botol, isi **Stok = 48** dan kosongkan kuota.

Kalau keduanya diisi, yang berlaku yang paling ketat.

Kalau produk punya varian, stok dan kuota dihitung **per produk**, bukan per varian. Ukuran S dan L memakai jatah yang sama.

Restock: buka **Edit**, ubah angka Stok, simpan.

### 7.3 Varian

Tekan tambah grup varian, beri nama grup (misal "Ukuran"), lalu isi opsinya (misal "Regular", "Large"). Angka **+Rp** di tiap opsi adalah **tambahan** dari harga dasar, bukan harga total. Isi 0 kalau tidak menambah harga.

Bisa lebih dari satu grup, misal "Ukuran" dan "Level Pedas". Pelanggan wajib memilih satu opsi dari tiap grup.

### 7.4 Sembunyikan vs hapus

- **Sembunyikan** (matikan **Tampilkan di Katalog**): produk hilang dari katalog tapi datanya tetap ada. Pakai untuk menu musiman atau yang sedang tidak dijual.
- **Hapus**: permanen, tidak bisa dibatalkan. Pesanan lama yang memuat produk itu tetap aman.
- Untuk stok yang habis sementara, jangan disembunyikan. Biarkan badge "Habis" yang bekerja, supaya pelanggan tahu produknya ada.

### 7.5 Import CSV

Untuk memasukkan banyak produk sekaligus. Tekan **Import CSV**, unduh template-nya dulu, isi di Excel atau Google Sheets, simpan sebagai CSV, lalu upload.

Kolomnya: `Nama`, `Deskripsi`, `Harga`, `Stok`, `Kuota per Tanggal`, `Badge New`, `Badge Terlaris`, `Tampil di Katalog`. Untuk kolom badge dan tampil, isi `ya` atau `tidak`.

- Baris yang nama, harga, stok, atau kuotanya tidak valid dilewati, bukan menggagalkan semuanya. Alasannya ditampilkan sebelum kamu menyetujui import.
- **Foto dan varian tidak bisa lewat CSV.** Tambahkan lewat Edit setelah import.
- Import selalu **menambah** produk baru. Mengimpor file yang sama dua kali menghasilkan produk dobel.

---

## 8. Tab Promo

Tekan **+ Tambah Promo**.

| Isian | Keterangan |
|---|---|
| Kode Promo | Huruf kapital tanpa spasi, misal `LEBARAN10` |
| Tipe Diskon | **% Persen** atau **Rp Nominal** |
| Nilai Diskon | Persen: 20 berarti 20%, maks 100. Nominal: 10000 berarti Rp 10.000 |
| Minimum Order (Rp) | Belanja minimal agar kode bisa dipakai. 0 = tanpa minimum |
| Berlaku Hingga | Opsional. Berlaku sampai akhir hari tanggal itu |
| Aktif | Matikan untuk menghentikan promo tanpa menghapusnya |

Diskon dihitung dari subtotal belanja, sebelum ongkir. Promo tidak dibatasi jumlah pemakaian atau per pelanggan: siapa pun yang tahu kodenya bisa memakainya berkali-kali sampai kamu matikan atau tanggalnya lewat.

---

## 9. Tab Pengaturan

### 9.1 Brand
- **Nama Brand**: dipakai di header, judul tab browser, dan pesan WhatsApp.
- **Ikon / Emoji**: dipakai kalau tidak ada logo gambar.
- **Logo Ikon**: gambar kecil di header katalog. Ini juga satu-satunya ikon di header dashboard admin.
- **Logo Teks / Wordmark**: menggantikan tulisan nama brand di header katalog.
- **Favicon**: ikon di tab browser. Paling rapi persegi, minimal 180 x 180 px.

### 9.2 Informasi Toko
- **Alamat Pickup**: tampil ke pelanggan yang memilih Pickup.
- **Jam Operasional**: teks bebas, misal "Senin sampai Sabtu, 08.00 sampai 17.00".
- **Link Google Maps**: dibuka saat pelanggan menekan "Buka di Google Maps". Ambil dari tombol Bagikan di aplikasi Google Maps.

### 9.3 Cara Pesan

**Mode Toko**
- **Siap hari itu juga**: pelanggan bisa memilih hari ini. Cocok untuk kedai dan toko yang menyiapkan pesanan di hari yang sama.
- **Pre-order (PO)**: hari ini tidak ditawarkan. Muncul isian tambahan **Tenggang Pesanan (hari)**: isi 2 kalau pesanan hari ini paling cepat diambil lusa.

Yang berubah hanya kalender di langkah 1 dan kalimat di sekitarnya. Menu, keranjang, dan pembayaran sama di dua mode.

**Tanggal yang Dibuka (hari)**: berapa hari ke depan yang bisa dipilih, dihitung dari tanggal paling awal. Default 7. Naikkan untuk hampers atau pesanan jauh hari.

### 9.4 Tanggal Libur
Pilih tanggal, isi alasan (opsional), tekan **Tambah**. Tersimpan langsung, tidak perlu tekan Simpan Pengaturan.

- Tanggal itu tertulis **Libur** di kalender pelanggan.
- Pelanggan yang sudah terlanjur memilih tanggal itu sebelum kamu menutupnya tetap **ditolak saat membayar**, dengan pesan bahwa toko tutup. Tidak ada pesanan yang lolos ke tanggal libur.
- Pesanan yang **sudah masuk** sebelum tanggalnya kamu tutup **tidak dibatalkan otomatis**. Cek filter tanggal di tab Pesanan, hubungi pelanggannya, dan batalkan kalau perlu.

### 9.5 Banner Katalog
Foto banner (maks 5 MB), judul, dan subjudul di bagian atas katalog. Bagus untuk mengumumkan menu baru atau jadwal PO.

### 9.6 Social Media
Link Instagram dan TikTok. Kosongkan kalau tidak punya, tombolnya tidak akan muncul.

Ingat tekan **Simpan Pengaturan** di paling bawah setelah mengubah isian apa pun selain Tanggal Libur.

---

## 10. Rutinitas yang disarankan

**Setiap hari**
- Buka tab Dashboard, cek **Menunggu konfirmasi kamu**.
- Cocokkan bukti transfer dengan mutasi, lalu Konfirmasi.
- Batalkan pesanan Menunggu yang tidak mengirim bukti dalam sehari (lihat 6.8).
- Tandai **Selesai** pesanan yang sudah diambil atau sampai.

**Sehari sebelum produksi**
- Tekan kartu **Harus siap besok**, baca **Rekap produksi**.
- Filter **Diproses** + tanggal besok, **Print N Label**.

**Setiap minggu**
- Cek stok produk yang dibatasi, restock lewat Edit.
- Tambahkan tanggal libur minggu depan kalau ada.
- Matikan promo yang sudah selesai.

**Setiap bulan**
- Filter **Selesai**, **Export CSV** untuk pembukuan.
- Lihat **Produk apa yang paling laku bulan ini?** di Dashboard.

---

## 11. Situasi yang sering terjadi

**Pelanggan bilang sudah bayar, tapi uangnya belum masuk.**
Jangan konfirmasi dulu. Minta bukti transfer yang memperlihatkan nominal dan waktu. Pesanan tetap Menunggu sampai kamu yakin.

**Pelanggan mau ganti isi pesanan atau tanggal.**
Pesanan tidak bisa diedit dari dashboard. Batalkan pesanan lama (stok kembali), minta pelanggan memesan ulang, lalu urus selisih bayarnya lewat WhatsApp.

**Produk mendadak habis di tengah hari.**
Edit produk, isi Stok = 0. Katalog langsung menampilkan "Habis".

**Toko mendadak tutup besok.**
Tambahkan tanggalnya di Tanggal Libur. Lalu buka tab Pesanan, filter tanggal besok, dan hubungi pelanggan yang sudah memesan. Pesanan mereka tidak dibatalkan otomatis.

**Kuota terlalu kecil untuk satu hari tertentu.**
Kuota berlaku sama untuk semua tanggal. Untuk menaikkan satu hari saja, naikkan kuota produknya, lalu kembalikan setelah tanggal itu lewat. Kuota berbeda per tanggal belum tersedia.

**Pelanggan lupa kode pesanannya.**
Cari pesanannya di tab Pesanan, buka Detail, kirim kodenya lewat **WA Customer**.

**Pelanggan tidak bisa pesan delivery karena "di luar jangkauan".**
Alamatnya melewati batas pengiriman. Tawarkan Pickup, atau atur pengiriman di luar sistem.

**Kode promo ditolak.**
Cek di tab Promo: masih Aktif, belum lewat Berlaku Hingga, dan belanja pelanggan sudah melewati Minimum Order.

**Ada pesanan masuk tapi tidak ada notifikasi.**
Notifikasi hanya muncul selama dashboard terbuka (lihat 6.7). Pesanannya tetap ada, muat ulang halaman.

**Pesanan Menunggu hilang dari daftar.**
Umurnya sudah lewat 24 jam tanpa dikonfirmasi (lihat 6.8). Kalau pelanggan ternyata sudah bayar, minta mereka memesan ulang lalu langsung konfirmasi. Koreksi stoknya kalau perlu.

---

## 12. Yang perlu bantuan tim Ordi

Hal-hal ini tidak bisa diubah dari dashboard:

- Ganti nomor WhatsApp toko yang menerima bukti transfer.
- Ganti QRIS toko.
- Ganti titik lokasi toko (patokan hitung ongkir dan urutan pencarian alamat).
- Tambah akun admin, atau reset password.
- Pindah paket (Basic, Antar, Bayar).

---

## 13. Batasan yang perlu kamu tahu

Supaya tidak ada kejutan:

- **Pembayaran tidak terverifikasi otomatis.** Kamu yang mencocokkan bukti dan mutasi.
- **Notifikasi hanya di dalam dashboard yang terbuka**, bukan notifikasi HP.
- **Belum ada uang muka (DP).** Pelanggan bayar penuh di muka.
- **Kuota satu angka per produk**, sama untuk semua tanggal. Belum ada kuota total tingkat toko.
- **Pesanan tidak bisa diedit**, hanya diubah statusnya.
- **Batalkan tidak bisa diurungkan.**
- **Ongkir untuk kurir instan dalam kota**, bukan pengiriman antarkota.
