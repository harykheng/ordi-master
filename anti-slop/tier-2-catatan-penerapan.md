# Catatan penerapan antislop di tier-2 (Antar)

Perbaikan antislop di branch ini diturunkan dari `main` lewat cherry-pick empat commit yang sama, lalu disesuaikan dengan fitur yang memang ada di paket Antar. Laporan `audit-001`, `audit-002`, dan `audit-003` di folder ini ditulis untuk `main`, jadi sebagian isinya menyebut layar yang tidak ada di sini. File ini mencatat bedanya.

## Fitur yang tidak ada di tier ini, jadi perbaikannya juga tidak ikut

Paket Antar punya cek ongkir otomatis dan pemilih alamat, tetapi tidak punya pembayaran QRIS. Jadi komponen berikut tidak pernah ada di branch ini: layar pembayaran QRIS, popup tampilkan QR ulang, dan pembangkit QRIS dinamis. Badge demo tier juga tidak ikut, karena itu memang khusus `main`.

## Yang disesuaikan, bukan disalin mentah

**Layar ringkasan pesanan.** Tier ini menutup pesanan lewat WhatsApp, bukan bukti transfer QRIS. Kalimat peringatannya tetap memakai kata-kata tier ini, tetapi ikut diperbaiki: tidak lagi ditulis huruf kapital semua, dan tombol WhatsApp sekarang disembunyikan jika nomor toko belum diatur, diganti pesan jujur berisi kode pesanan (temuan 6). Tombol tampilkan QR ulang tidak ada di sini.

**Tombol checkout.** Tetap "Checkout via WhatsApp", hanya emoji di ujungnya yang dibuang.

**Perilaku keyboard dialog.** Sama seperti tier lain, hanya tanpa penjagaan untuk popup QR yang memang tidak ada.

## Yang berlaku sama persis seperti main

Kontras warna, ukuran target sentuh 44 px, pinch zoom yang tidak lagi dikunci, pemilih alamat layar penuh berikut perbaikan keyboardnya, keadaan gagal di dashboard admin, penghapusan emoji dekoratif, penyeragaman label seksi, animasi yang menghormati `prefers-reduced-motion`, token warna status, dan hierarki dashboard admin.

## Verifikasi

`npm run build` lolos. Diuji di Chromium pada lebar 320 px dan 390 px: alur customer langkah 1 sampai 3, halaman lacak pesanan, layar login admin, dan kelima tab admin dalam keadaan sudah login. Tidak ada overflow horizontal, tidak ada target sentuh di bawah 44 px, tidak ada teks yang gagal WCAG AA, tidak ada error JavaScript.
