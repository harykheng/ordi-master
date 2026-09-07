# DESIGN.md: arah desain Ordi Master

Arah desain untuk ketiga aplikasi di repo ini (katalog customer, dashboard admin, halaman lacak pesanan). File ini adalah **sumber arah**; `anti-slop/` berisi filternya. Kalau keduanya bertabrakan, arah di sini yang menang soal rasa, filter yang menang soal aturan keras (kontras, keyboard, target sentuh, klaim palsu).

Ditulis setelah audit antislop 001 dan 002, dengan cara membaca balik keputusan yang sudah ada di CSS lalu menuliskan alasannya. Jadi ini bukan desain ulang, ini pengakuan tertulis atas desain yang sudah jalan.

---

## Siapa yang pakai

Dua kelompok, kebutuhannya beda tajam.

**Pelanggan UMKM F&B** memesan dari HP, sering sambil jalan, sering sekali pakai. Mereka tidak akan belajar antarmuka ini. Target: dari buka link sampai QR pembayaran muncul, tanpa perlu berpikir, tanpa perlu daftar akun.

**Pemilik toko** membuka dashboard beberapa kali sehari, juga dari HP, biasanya di sela melayani pembeli. Satu pertanyaan yang dia bawa hampir selalu sama: ada yang perlu dikonfirmasi tidak?

## Identitas

Hangat, rapi, ramah, tidak korporat. Nada bicara santai dan memakai "kamu", bukan "Anda". Ini toko kecil yang ngobrol dengan pelanggannya, bukan aplikasi perusahaan.

Palet cokelat-krem berasal dari klien pertama, sebuah kedai kopi. **Untuk klien baru, palet ini yang pertama harus diganti.** Warna status (menunggu, diproses, selesai, dibatalkan) tidak ikut diganti, itu fungsi, bukan brand.

## Dial

**ENERGY 2 / RHYTHM 1 / MOTION 2**

**ENERGY 2** karena halaman ini harus terasa milik sebuah toko yang punya selera, tapi tidak boleh menarik perhatian ke dirinya sendiri. Yang dijual makanan, bukan situsnya.

**RHYTHM 1 disengaja, bukan kecelakaan.** Alur pesan tiga langkah memang harus seragam: tiap layar berbentuk sama supaya pelanggan yang belum pernah pakai tetap tahu di mana tombol lanjut. Variasi komposisi di sini akan menambah beban baca tanpa menambah apa pun. Kalau nanti ada yang mau "bikin lebih hidup" dengan mengacak layout tiap seksi, itu melawan keputusan ini, bukan memperbaikinya.

**MOTION 2** artinya transisi antar langkah dan umpan balik tombol, bukan koreografi. Animasi masuk berjenjang di daftar produk sudah dibuang karena menunda tampilnya harga. Yang tersisa punya tugas: transisi langkah memberi arah maju, `pop`/`bounce` di stepper jumlah membalas tekanan jari, overlay ongkir bergerak selama menunggu Biteship. Semuanya patuh `prefers-reduced-motion`.

## Palet

Token ada di `css/main.css`. Dua warna inti, satu aksen, sisanya netral.

| Peran | Token | Nilai | Alasan |
|---|---|---|---|
| Inti | `--primary` | `#553125` | Cokelat gelap. Dipakai untuk tombol utama, teks tegas, dan status terpilih. Kontras 11.34:1 dengan putih, jadi aman dipakai di mana saja. |
| Inti | `--cream` | `#fdf8f4` | Latar hangat. Membedakan kartu dari halaman tanpa perlu garis tambahan. |
| Aksen | `--latte` | `#c4956a` | Dipakai hemat: garis kiri toast, batas kartu saat hover, inisial placeholder produk. Terlalu terang untuk teks putih di atasnya, jadi jangan dipakai sebagai latar tombol berteks putih. |
| Teks | `--text-dark` / `--text-mid` / `--text-soft` | `#1a0f0a` / `#6b4c3b` / `#7f5f4e` | Tiga tingkat saja. `--text-soft` sengaja digelapkan dari nilai lama `#a08070` karena yang lama hanya 3.61:1. |

Warna status terpisah dari palet brand dan didefinisikan sekali di `main.css` (`--status-*`), karena empat status pesanan yang sama digambar di tiga aplikasi. Perbaikan kontras harus mendarat di satu tempat, bukan sembilan.

Aturan yang harus dijaga: setiap pasangan teks dan latar minimal 4.5:1 (3:1 untuk teks besar). Hitung, jangan dikira-kira. Skrip pengeceknya ada di `anti-slop` upstream (`skills/antislop-human/contrast-check.py`).

## Tipografi

**Plus Jakarta Sans** untuk customer dan tracking. Huruf latin buatan Indonesia, bentuknya ramah tapi tidak lucu-lucuan, dan angkanya jelas. Angka penting di sini, hampir setiap layar menampilkan harga.

**Nunito** untuk admin, tersisa dari versi vanilla. Boleh disatukan ke Plus Jakarta Sans kalau ada yang menyentuh area ini; belum dilakukan karena tidak ada yang rusak.

Skala: 11 sampai 13px untuk label, 14 sampai 15px untuk isi, 16px untuk kolom input (di bawah itu iOS otomatis zoom saat kolom difokus, dan itu memaksa kita mematikan pinch zoom, yang tidak boleh). Judul memakai `clamp(30px, 8vw, 38px)`.

Label seksi ditulis sentence case, 13px, bold, `--text-mid`. Huruf kapital semua dengan jarak huruf lebar sudah dibuang. Yang masih kapital hanya chip status pendek (`.product-badge`, `.admin-tag`), di situ kapital membaca sebagai chip, bukan judul.

## Bentuk dan jarak

Radius: 10 / 16 / 22 / 28px, dipakai bertingkat, bukan seragam. Chip status memakai pill; kartu tidak. Radius adalah alat hierarki di sini.

Bayangan hanya untuk elevasi nyata: modal, toast, kartu saat hover. Kartu diam memakai garis tepi, bukan bayangan.

Semua yang bisa ditekan minimal 44 x 44px. Tombol berteks mendapat tinggi 44px sungguhan; tombol ikon bundar yang berdiri sendiri memakai pseudo-element tak terlihat supaya header yang padat tidak berubah bentuk. Dua kontrol bersebelahan tidak boleh berbagi area sentuh.

Lebar konten customer dibatasi 480px. Aplikasi ini dirancang untuk HP; tampilan desktop adalah kolom yang sama di tengah layar, bukan layout terpisah.

## Motif

**Alur maju.** Panah `→` hanya pada tombol yang memajukan langkah ("Lihat Menu", "Lanjutkan"). Itu satu-satunya tempat panah boleh muncul, dan itulah yang membuatnya berarti. Link keluar (Google Maps, lacak pesanan) tidak memakai panah karena tidak memajukan alur. Chevron `›` pada kartu profil adalah penanda "ini bisa dibuka", bukan hiasan.

**Emoji hanya kalau membawa informasi.** Aturannya: emoji boleh kalau ia satu-satunya isi elemen dan punya `aria-label`, kalau ia menandai tipe pesanan (pickup atau delivery), atau kalau ia penanda peringatan sungguhan. Emoji yang duduk di samping label teks yang sudah mengatakan hal yang sama harus dibuang. Ini yang membedakan suara santai dari kebisingan.

**Ikon brand dari pengaturan.** Slot ikon apa pun membaca `settings.brand_icon`, tidak pernah dihardcode. Placeholder gambar produk memakai huruf pertama nama produk. Template ini melayani banyak jenis toko; menganggap semuanya jualan kopi adalah bug identitas.

## Hierarki per layar

Satu titik fokus per layar, sisanya mengalah.

| Layar | Fokusnya |
|---|---|
| Langkah 1 | Judul "Mau pickup atau delivery?" dan dua kartu pilihan |
| Langkah 2 | Grid produk; banner mengalah, bar keranjang muncul hanya setelah ada isinya |
| Langkah 3 | Total dan tombol bayar |
| Lacak pesanan | Kartu status |
| Dashboard admin | Jumlah pesanan yang menunggu konfirmasi, lengkap dengan tombol ke sana |

Dashboard admin adalah yang paling gampang salah. Godaannya membangun shell dashboard standar: sidebar, deretan kartu angka, chart, tabel. Yang benar adalah menaruh keputusan yang diambil admin di paling atas. Kartu angka dan chart adalah konteks, bukan isi utama.

## Konten

Angka ditampilkan hanya kalau nyata. Semua angka di dashboard dihitung dari tabel `orders` dan `daily_visits`, tidak ada yang dikarang. Pendapatan hanya menghitung status `confirmed` dan `done`, karena `pending` baru klaim pelanggan yang belum diverifikasi. Aturan itu ditulis di judul chart supaya admin tahu.

Placeholder ditulis apa adanya (`08xxxxxxxxxx`, `Contoh: nama produk`), tidak pernah data palsu yang kelihatan asli. Tidak ada testimoni, tidak ada "dipercaya oleh", tidak ada klaim keamanan.

Setiap tampilan data punya tiga keadaan: kosong, memuat, dan gagal. Keadaan gagal menyebutkan apa yang gagal dan menawarkan coba lagi, tidak boleh menyamar jadi "belum ada data".

## Yang belum diputuskan

- Font admin masih beda dari customer. Disatukan atau tidak, belum ada keputusan.
- Tema gelap belum ada dan belum dibutuhkan. Katalog makanan dilihat siang hari di luar ruangan; latar terang lebih terbaca. Kalau nanti dibuat, kedua mode wajib berfungsi penuh.
- Ikon: sekarang campuran emoji dan SVG inline (Instagram, TikTok). Belum ada set ikon yang dipilih sadar.
