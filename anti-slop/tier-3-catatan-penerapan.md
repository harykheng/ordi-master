# Catatan penerapan antislop di tier-3 (Bayar)

Perbaikan antislop di branch ini diturunkan dari `main` lewat cherry-pick empat commit yang sama. Tier ini paling dekat dengan `main`, jadi hampir semuanya berlaku apa adanya.

## Yang tidak ikut turun

Hanya badge demo tier (`TierBadge`, `TierCompareModal`, dan flag `demoMode`) berikut CSS-nya. Itu memang khusus `main`, dipakai untuk demo jualan ke calon klien, dan tidak relevan di deployment klien yang cuma punya satu paket. Google tag di halaman customer juga tidak ikut, karena branch ini memang tidak memasangnya.

## Yang berlaku sama persis seperti main

Semua sisanya: kontras warna, ukuran target sentuh 44 px, pinch zoom yang tidak lagi dikunci, perilaku keyboard di seluruh dialog, penjagaan link kosong, keadaan gagal di dashboard admin, penghapusan emoji dekoratif, penyeragaman label seksi, animasi yang menghormati `prefers-reduced-motion`, token warna status, hierarki dashboard admin, serta `DESIGN.md` dan tiga laporan audit.

## Verifikasi

`npm run build` lolos. Diuji di Chromium pada lebar 320 px dan 390 px: alur customer langkah 1 sampai 3, halaman lacak pesanan, layar login admin, dan kelima tab admin dalam keadaan sudah login. Tidak ada overflow horizontal, tidak ada target sentuh di bawah 44 px, tidak ada teks yang gagal WCAG AA, tidak ada error JavaScript.
