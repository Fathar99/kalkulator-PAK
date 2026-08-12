# Kalkulator PAK

Kalkulator web statis (HTML/CSS/JS murni, tanpa build tool) untuk menghitung:

1. **PAK Integrasi** — hasil penyesuaian dari PAK Konvensional terakhir (s.d. 31 Desember 2022), dikurangi nilai dasar sesuai golongan, mengacu **Peraturan BKN No. 11 Tahun 2022**.
2. **PAK Konversi** — akumulasi angka kredit hasil konversi predikat kinerja (Sangat Baik/Baik/Cukup/Kurang/Sangat Kurang) per **periode penilaian**, tidak harus setahun penuh (bisa 2, 3, 6, atau 12 bulan). Dihitung proporsional sesuai **Peraturan BKN No. 3 Tahun 2023**: `AK = (jumlah bulan periode ÷ 12) × persentase predikat × koefisien tahunan`.
3. **Proyeksi waktu kenaikan pangkat** — estimasi berapa tahun lagi angka kredit tercukupi untuk kenaikan pangkat berikutnya, berdasarkan predikat kinerja yang diisi/diasumsikan.

## Struktur berkas

```
index.html   isi & struktur halaman
style.css    tampilan (tema "ledger/stempel" administratif)
app.js       data koefisien AK per jenjang & logika kalkulasi
```

Tidak ada dependency build (npm, webpack, dsb). Semua font dimuat langsung dari Google Fonts via CDN saat halaman dibuka.

## Menjalankan secara lokal

Buka `index.html` langsung di browser, atau jalankan server statis sederhana:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `kalkulator-pak`.
2. Push ketiga berkas di atas ke branch `main`:
   ```bash
   git init
   git add index.html style.css app.js README.md
   git commit -m "Kalkulator PAK"
   git branch -M main
   git remote add origin https://github.com/<username>/kalkulator-pak.git
   git push -u origin main
   ```
3. Di GitHub: **Settings → Pages → Build and deployment → Source**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu beberapa menit, situs akan tersedia di:
   `https://<username>.github.io/kalkulator-pak/`

## Catatan penting

- Ini alat bantu estimasi mandiri, **bukan** penetapan PAK resmi.
- Kenaikan jenjang (bukan sekadar kenaikan pangkat/golongan dalam jenjang yang sama) tetap mensyaratkan **uji kompetensi** dan pemenuhan syarat lain di luar angka kredit.
- Kenaikan pangkat tetap mensyaratkan masa kerja minimal dalam pangkat terakhir sesuai ketentuan kepegawaian yang berlaku.
- Nilai dasar & koefisien angka kredit di `app.js` mengikuti pola umum (generic) yang berlaku di sebagian besar jabatan fungsional — untuk jabatan fungsional dengan pengaturan khusus (mis. Guru dengan Permenpan RB No. 16/2009 dan turunannya), periksa kembali angka pada peraturan JF yang bersangkutan sebelum digunakan sebagai acuan resmi.
- Verifikasi akhir tetap mengacu pada SIASN/MyASN dan instansi pembina jabatan fungsional terkait.
