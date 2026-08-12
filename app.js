/* =========================================================================
   Kalkulator PAK — data & logika
   Sumber:
   - Permenpan RB No. 1 Tahun 2023 tentang Jabatan Fungsional
   - Peraturan BKN No. 3 Tahun 2023 tentang Angka Kredit, Kenaikan Pangkat
     dan Jenjang Jabatan Fungsional
   - Peraturan BKN No. 11 Tahun 2022 tentang Pedoman Teknis Pembinaan
     Kepegawaian Jabatan Fungsional (nilai dasar konvensional -> integrasi)
   ========================================================================= */

const JENJANG_DATA = {
  keahlian: {
    "Ahli Pertama": {
      golongan: ["III/a", "III/b"],
      koefisienTahunan: 12.5,
      targetPangkat: 50,
      targetJenjang: 100,
      nilaiDasar: { "III/a": 100, "III/b": 150 }
    },
    "Ahli Muda": {
      golongan: ["III/c", "III/d"],
      koefisienTahunan: 25,
      targetPangkat: 100,
      targetJenjang: 200,
      nilaiDasar: { "III/c": 200, "III/d": 300 }
    },
    "Ahli Madya": {
      golongan: ["IV/a", "IV/b", "IV/c"],
      koefisienTahunan: 37.5,
      targetPangkat: 150,
      targetJenjang: 450,
      nilaiDasar: { "IV/a": 400, "IV/b": 550, "IV/c": 700 }
    },
    "Ahli Utama": {
      golongan: ["IV/d", "IV/e"],
      koefisienTahunan: 50,
      targetPangkat: 200,
      targetJenjang: null,
      nilaiDasar: { "IV/d": 850, "IV/e": 1050 },
      puncak: "IV/e"
    }
  },
  keterampilan: {
    "Terampil": {
      golongan: ["II/b", "II/c", "II/d"],
      koefisienTahunan: 5,
      targetPangkat: 20,
      targetJenjang: 60,
      nilaiDasar: { "II/b": 40, "II/c": 60, "II/d": 80 }
    },
    "Mahir": {
      golongan: ["III/a", "III/b"],
      koefisienTahunan: 12.5,
      targetPangkat: 50,
      targetJenjang: 100,
      nilaiDasar: { "III/a": 100, "III/b": 150 }
    },
    "Penyelia": {
      golongan: ["III/c", "III/d"],
      koefisienTahunan: 25,
      targetPangkat: 100,
      targetJenjang: null,
      nilaiDasar: { "III/c": 200, "III/d": 300 },
      puncak: "III/d"
    }
  }
};

const PREDIKAT = [
  { label: "Sangat Baik", pct: 1.50 },
  { label: "Baik", pct: 1.00 },
  { label: "Cukup / Butuh Perbaikan", pct: 0.75 },
  { label: "Kurang", pct: 0.50 },
  { label: "Sangat Kurang", pct: 0.25 }
];

const fmt = (n) => {
  const r = Math.round(n * 100) / 100;
  return r.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const $ = (id) => document.getElementById(id);

/* ---------------------------- elemen DOM ---------------------------- */
const elKategori = $("kategori");
const elJenjang = $("jenjang");
const elGolongan = $("golongan");
const elJenjangInfo = $("jenjangInfo");

const elAkKonvensional = $("akKonvensional");
const elOutKonvensional = $("outKonvensional");
const elOutNilaiDasar = $("outNilaiDasar");
const elOutIntegrasi = $("outIntegrasi");
const elGolLabel1 = $("golLabel1");
const elWarnIntegrasi = $("warnIntegrasi");

const elTahunMulai = $("tahunMulai");
const elPredikatBody = $("predikatBody");
const elAddYear = $("addYear");

const elResKumulatif = $("resKumulatif");
const elResTarget = $("resTarget");
const elResSisa = $("resSisa");
const elVerdict = $("verdict");
const elStampPct = $("stampPct");
const elStampRing = $("stampRing");
const elProjBody = $("projBody");

const RING_CIRC = 578; // 2 * PI * 92, dibulatkan sesuai stroke-dasharray di CSS

/* ---------------------------- opsi jenjang/golongan ---------------------------- */
function populateJenjang() {
  const kat = elKategori.value;
  const jenjangs = Object.keys(JENJANG_DATA[kat]);
  elJenjang.innerHTML = jenjangs.map(j => `<option value="${j}">${j}</option>`).join("");
  populateGolongan();
}

function populateGolongan() {
  const kat = elKategori.value;
  const data = JENJANG_DATA[kat][elJenjang.value];
  elGolongan.innerHTML = data.golongan.map(g => `<option value="${g}">${g}</option>`).join("");
  onJenjangChange();
}

function currentData() {
  return JENJANG_DATA[elKategori.value][elJenjang.value];
}

function isPuncak() {
  const data = currentData();
  return data.puncak && data.puncak === elGolongan.value;
}

function onJenjangChange() {
  const data = currentData();
  const gol = elGolongan.value;
  elJenjangInfo.innerHTML = `
    <span>Koefisien AK tahunan: <b>${fmt(data.koefisienTahunan)}</b></span>
    <span>Target naik pangkat: <b>${isPuncak() ? "—" : fmt(data.targetPangkat)}</b></span>
    <span>Nilai dasar golongan ${gol}: <b>${fmt(data.nilaiDasar[gol])}</b></span>
  `;
  elGolLabel1.textContent = `(${elKategori.value === "keahlian" ? elJenjang.value : elJenjang.value} ${gol})`;
  recalcAll();
}

/* ---------------------------- PAK Integrasi ---------------------------- */
function computeIntegrasi() {
  const data = currentData();
  const gol = elGolongan.value;
  const nilaiDasar = data.nilaiDasar[gol];
  const konvensional = parseFloat(elAkKonvensional.value) || 0;
  let integrasi = konvensional - nilaiDasar;

  elOutKonvensional.textContent = fmt(konvensional);
  elOutNilaiDasar.textContent = `− ${fmt(nilaiDasar)}`;

  if (integrasi < 0) {
    elWarnIntegrasi.hidden = false;
    elWarnIntegrasi.textContent = `PAK Konvensional (${fmt(konvensional)}) masih di bawah nilai dasar golongan ${gol} (${fmt(nilaiDasar)}). Periksa kembali PAK konvensional atau golongan yang dipilih — PAK Integrasi disetel ke 0.`;
    integrasi = 0;
  } else {
    elWarnIntegrasi.hidden = true;
  }

  elOutIntegrasi.textContent = fmt(integrasi);
  return integrasi;
}

/* ---------------------------- tabel predikat kinerja ---------------------------- */
function predikatOptionsHtml(selected) {
  return PREDIKAT.map(p =>
    `<option value="${p.label}" ${p.label === selected ? "selected" : ""}>${p.label}</option>`
  ).join("");
}

function addYearRow(tahun, predikatLabel) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="number" class="rowTahun" value="${tahun}" min="2023" max="2100"></td>
    <td><select class="rowPredikat">${predikatOptionsHtml(predikatLabel)}</select></td>
    <td class="num rowAk">0</td>
    <td><button type="button" class="rowRemove" title="Hapus baris" aria-label="Hapus baris">✕</button></td>
  `;
  elPredikatBody.appendChild(tr);

  tr.querySelector(".rowTahun").addEventListener("input", recalcAll);
  tr.querySelector(".rowPredikat").addEventListener("change", recalcAll);
  tr.querySelector(".rowRemove").addEventListener("click", () => {
    if (elPredikatBody.rows.length <= 1) return;
    tr.remove();
    recalcAll();
  });
}

function readRows() {
  return Array.from(elPredikatBody.rows).map(tr => {
    const tahun = parseInt(tr.querySelector(".rowTahun").value, 10);
    const label = tr.querySelector(".rowPredikat").value;
    const pct = PREDIKAT.find(p => p.label === label).pct;
    return { tr, tahun, label, pct };
  }).sort((a, b) => a.tahun - b.tahun);
}

/* ---------------------------- proyeksi ---------------------------- */
function recalcAll() {
  const data = currentData();
  const baseline = computeIntegrasi();
  const rows = readRows();
  const koef = data.koefisienTahunan;

  // isi kolom AK per baris pada tabel input (section 03)
  rows.forEach(r => {
    const ak = koef * r.pct;
    r.ak = ak;
    r.tr.querySelector(".rowAk").textContent = fmt(ak);
  });

  const target = isPuncak() ? null : data.targetPangkat;

  elResTarget.textContent = target === null ? "—" : fmt(target);

  // kumulatif berjalan dari baseline + baris-baris yang dientri user
  let running = baseline;
  let reachedAtEntered = null;
  rows.forEach(r => {
    running += r.ak;
    if (target !== null && reachedAtEntered === null && running >= target) {
      reachedAtEntered = { tahun: r.tahun, kumulatif: running };
    }
  });

  elResKumulatif.textContent = fmt(running);

  // render proj table: baris yang sudah dientri + (jika perlu) proyeksi tahun tambahan
  elProjBody.innerHTML = "";
  let cum = baseline;
  let reached = false;
  rows.forEach(r => {
    cum += r.ak;
    if (!reached && target !== null && cum >= target) reached = true;
    appendProjRow(r.tahun, r.label, r.ak, cum, reached && target !== null && cum >= target, false);
  });

  let extraYears = 0;
  if (target !== null && !reached && rows.length > 0) {
    const last = rows[rows.length - 1];
    let tahun = last.tahun;
    let guard = 0;
    while (cum < target && guard < 200) {
      tahun += 1;
      cum += last.ak;
      guard += 1;
      extraYears += 1;
      const isDone = cum >= target;
      appendProjRow(tahun, last.label + " (asumsi)", last.ak, cum, isDone, true);
      if (isDone) break;
    }
  }

  // ringkasan & verdict
  const sisa = target === null ? 0 : Math.max(0, target - running);
  elResSisa.textContent = target === null ? "—" : fmt(sisa);

  if (target === null) {
    setVerdict("neutral", "Golongan ini sudah berada pada jenjang tertinggi jalur angka kredit. Kenaikan lebih lanjut mengikuti mekanisme tersendiri (mis. perpindahan jabatan), bukan akumulasi AK reguler.");
    setStamp(100);
  } else if (running >= target) {
    const tahunCukup = reachedAtEntered ? reachedAtEntered.tahun : "—";
    setVerdict("positive", `PAK sudah tercukupi untuk naik pangkat (tercapai pada tahun ${tahunCukup}). Kenaikan tetap menunggu masa kerja minimal 2 tahun dalam pangkat terakhir dan proses administrasi usulan.`);
    setStamp(100);
  } else if (extraYears > 0) {
    const tahunSelesai = rows.length ? rows[rows.length - 1].tahun + extraYears : "—";
    setVerdict("neutral", `Dengan asumsi predikat kinerja "${rows[rows.length - 1].label}" berulang tiap tahun, PAK diperkirakan cukup dalam ${extraYears} tahun lagi (± tahun ${tahunSelesai}).`);
    setStamp(Math.min(100, (running / target) * 100));
  } else {
    setVerdict("neutral", "Tambahkan minimal satu tahun predikat kinerja untuk menghitung proyeksi.");
    setStamp(target ? Math.min(100, (running / target) * 100) : 0);
  }
}

function appendProjRow(tahun, label, ak, kumulatif, isReachedRow, isProjected) {
  const tr = document.createElement("tr");
  if (isProjected) tr.style.opacity = "0.62";
  const pill = isReachedRow
    ? `<span class="pill pill--done">Tercapai</span>`
    : `<span class="pill pill--wait">Menuju</span>`;
  tr.innerHTML = `
    <td>${tahun}</td>
    <td>${label}</td>
    <td class="num">${fmt(ak)}</td>
    <td class="num">${fmt(kumulatif)}</td>
    <td>${pill}</td>
  `;
  elProjBody.appendChild(tr);
}

function setVerdict(kind, text) {
  elVerdict.textContent = text;
  elVerdict.className = "verdict"; // reset ke gaya dasar (hijau/positif)
  if (kind === "neutral") elVerdict.classList.add("is-neutral");
  if (kind === "negative") elVerdict.classList.add("is-negative");
}

function setStamp(pct) {
  const clamped = Math.max(0, Math.min(100, pct));
  elStampPct.textContent = `${Math.round(clamped)}%`;
  const offset = RING_CIRC - (RING_CIRC * clamped) / 100;
  elStampRing.style.strokeDashoffset = offset;
}

/* ---------------------------- inisialisasi & event ---------------------------- */
elKategori.addEventListener("change", populateJenjang);
elJenjang.addEventListener("change", populateGolongan);
elGolongan.addEventListener("change", onJenjangChange);
elAkKonvensional.addEventListener("input", recalcAll);
elTahunMulai.addEventListener("input", () => {
  if (elPredikatBody.rows.length === 1) {
    elPredikatBody.rows[0].querySelector(".rowTahun").value = elTahunMulai.value;
    recalcAll();
  }
});
elAddYear.addEventListener("click", () => {
  const rows = readRows();
  const lastTahun = rows.length ? rows[rows.length - 1].tahun : parseInt(elTahunMulai.value, 10);
  const lastLabel = rows.length ? rows[rows.length - 1].label : "Baik";
  addYearRow(lastTahun + 1, lastLabel);
  recalcAll();
});

populateJenjang();
addYearRow(parseInt(elTahunMulai.value, 10), "Baik");
recalcAll();
