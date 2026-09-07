# Catatan penerapan antislop di tier-1 (Basic)

Perbaikan antislop di branch ini diturunkan dari `main` lewat cherry-pick empat commit yang sama, lalu disesuaikan dengan fitur yang memang ada di paket Basic. Laporan `audit-001`, `audit-002`, dan `audit-003` di folder ini ditulis untuk `main`, jadi sebagian isinya menyebut layar yang tidak ada di sini. File ini mencatat bedanya.

## Fitur yang tidak ada di tier ini, jadi perbaikannya juga tidak ikut

Paket Basic tidak punya cek ongkir otomatis dan tidak punya pembayaran QRIS, sehingga komponen berikut tidak pernah ada di branch ini dan perbaikan antislop untuknya tidak relevan: layar pembayaran QRIS dan popup tampilkan QR ulang, pilihan kurir, overlay loading ongkir, pemilih alamat layar penuh berikut pratinjau petanya, dan badge demo tier yang memang khusus `main`.

## Yang disesuaikan, bukan disalin mentah

**Alamat pengiriman.** Tier ini memakai kolom teks biasa, bukan pemilih alamat layar penuh. Perbaikan yang diterapkan di sini adalah membuang em dash dari teks bantuannya, bukan mengganti alurnya.

**Layar ringkasan pesanan.** Tier ini menutup pesanan lewat WhatsApp, bukan bukti transfer QRIS. Kalimat peringatannya tetap memakai kata-kata tier ini, tetapi ikut diperbaiki: tidak lagi ditulis huruf kapital semua, dan tombol WhatsApp sekarang disembunyikan jika nomor toko belum diatur, diganti pesan jujur berisi kode pesanan (temuan 6).

**Tombol checkout.** Tetap "Checkout via WhatsApp", hanya emoji di ujungnya yang dibuang.

**Modal profil.** Mendapat perilaku keyboard yang sama seperti tier lain (Escape menutup, fokus masuk dan kembali), tanpa penjagaan tambahan untuk pemilih alamat karena tier ini tidak menumpuk dialog.

## Yang berlaku sama persis seperti main

Kontras warna, ukuran target sentuh 44 px, pinch zoom yang tidak lagi dikunci, keadaan gagal di dashboard admin, penghapusan emoji dekoratif, penyeragaman label seksi, animasi yang menghormati `prefers-reduced-motion`, token warna status, dan hierarki dashboard admin.

## Verifikasi

`npm run build` lolos. Diuji di Chromium pada lebar 320 px dan 390 px: alur customer langkah 1 sampai 3, halaman lacak pesanan, layar login admin, dan kelima tab admin dalam keadaan sudah login. Tidak ada overflow horizontal, tidak ada target sentuh di bawah 44 px, tidak ada teks yang gagal WCAG AA, tidak ada error JavaScript.
