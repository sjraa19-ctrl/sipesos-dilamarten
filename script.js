// Key penyimpanan lokal browser
const STORAGE_KEY = 'sipesos_students_v1';

// State sementara foto yang diunggah siswa
let tempPhotos = {
  depan: '',
  dalam: ''
};

let currentUser = null;

// Data contoh awal agar halaman Admin langsung terlihat hidup
const INITIAL_DATA = [
  {
    nisn: '0084512901',
    nama: 'Ahmad Fauzi Pratama',
    kelas: 'XI TKJ 2',
    phone: '081234567890',
    statusKeluarga: 'Yatim',
    ekonomi: 'Kurang Mampu',
    pekerjaan: 'Buruh Cuci & Setrika',
    tanggungan: 4,
    kepemilikanRumah: 'Kontrak / Sewa',
    bantuan: 'KIP (Kartu Indonesia Pintar)',
    alamat: 'Jl. Muharto Gg. 5B No. 12, RT 04 / RW 07',
    kelurahan: 'Kotalama',
    kecamatan: 'Kedungkandang, Kota Malang',
    koordinat: '-7.9912, 112.6365',
    fotoDepan: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
    fotoDalam: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    statusVerifikasi: 'Menunggu Verifikasi',
    catatanAdmin: ''
  },
  {
    nisn: '0087721345',
    nama: 'Siti Nurhaliza Putri',
    kelas: 'XI RPL 1',
    phone: '085712349876',
    statusKeluarga: 'Lengkap',
    ekonomi: 'Menengah Bawah',
    pekerjaan: 'Pedagang Kaki Lima',
    tanggungan: 3,
    kepemilikanRumah: 'Milik Sendiri',
    bantuan: 'PKH / KKS',
    alamat: 'Jl. Simpang Gajayana No. 45, RT 02 / RW 03',
    kelurahan: 'Dinoyo',
    kecamatan: 'Lowokwaru, Kota Malang',
    koordinat: '-7.9431, 112.6089',
    fotoDepan: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
    fotoDalam: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    statusVerifikasi: 'Terverifikasi',
    catatanAdmin: 'Layak direkomendasikan penerima bantuan seragam & SPP.'
  }
];

// Inisialisasi data saat halaman pertama dibuka
function getStudentsData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(saved);
}

function saveStudentsData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ================= SISTEM LOGIN & LOGOUT =================
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const role = document.getElementById('loginRole').value;
  const username = document.getElementById('loginUsername').value.trim();
  if (!username) return;

  enterApp(role, username);
});

function quickLogin(role) {
  if (role === 'siswa') {
    enterApp('siswa', '0084512901');
  } else {
    enterApp('admin', 'Admin Kesiswaan');
  }
}

function enterApp(role, username) {
  currentUser = { role, username };

  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('appShell').classList.remove('hidden');

  const roleBadge = document.getElementById('roleBadge');
  roleBadge.textContent = role === 'admin' ? 'Admin' : 'Siswa';
  roleBadge.className = role === 'admin' ? 'badge badge-danger' : 'badge badge-primary';

  if (role === 'siswa') {
    document.getElementById('siswaView').classList.remove('hidden');
    document.getElementById('adminView').classList.add('hidden');
    loadStudentForm(username);
  } else {
    document.getElementById('adminView').classList.remove('hidden');
    document.getElementById('siswaView').classList.add('hidden');
    document.getElementById('currentUserName').textContent = `Halo, ${username}`;
    renderAdminDashboard();
  }
}

function logout() {
  currentUser = null;
  document.getElementById('appShell').classList.add('hidden');
  document.getElementById('loginView').classList.remove('hidden');
}

// ================= LOGIKA HALAMAN SISWA =================
function loadStudentForm(identifier) {
  const students = getStudentsData();
  const existing = students.find(s => s.nisn === identifier || s.nama.toLowerCase() === identifier.toLowerCase());

  if (existing) {
    document.getElementById('currentUserName').textContent = `Halo, ${existing.nama}`;
    document.getElementById('sNisn').value = existing.nisn;
    document.getElementById('sNama').value = existing.nama;
    document.getElementById('sKelas').value = existing.kelas;
    document.getElementById('sPhone').value = existing.phone;
    document.getElementById('sStatusKeluarga').value = existing.statusKeluarga;
    document.getElementById('sEkonomi').value = existing.ekonomi;
    document.getElementById('sPekerjaan').value = existing.pekerjaan;
    document.getElementById('sTanggungan').value = existing.tanggungan;
    document.getElementById('sKepemilikanRumah').value = existing.kepemilikanRumah;
    document.getElementById('sBantuan').value = existing.bantuan;
    document.getElementById('sAlamat').value = existing.alamat;
    document.getElementById('sKelurahan').value = existing.kelurahan;
    document.getElementById('sKecamatan').value = existing.kecamatan;
    document.getElementById('sKoordinat').value = existing.koordinat || '';

    // Tampilkan foto lama jika sudah ada
    if (existing.fotoDepan) {
      tempPhotos.depan = existing.fotoDepan;
      showImagePreview('previewDepan', 'placeholderDepan', existing.fotoDepan);
    }
    if (existing.fotoDalam) {
      tempPhotos.dalam = existing.fotoDalam;
      showImagePreview('previewDalam', 'placeholderDalam', existing.fotoDalam);
    }

    // Update badge status verifikasi
    const banner = document.getElementById('studentStatusBanner');
    if (existing.statusVerifikasi === 'Terverifikasi') {
      banner.className = 'status-pill status-verified';
      banner.innerHTML = '<i class="fa-solid fa-circle-check"></i> Status: Terverifikasi Admin';
    } else {
      banner.className = 'status-pill status-pending';
      banner.innerHTML = '<i class="fa-solid fa-clock"></i> Status: Menunggu Verifikasi';
    }
  } else {
    document.getElementById('currentUserName').textContent = `Halo, ${identifier}`;
    document.getElementById('studentDataForm').reset();
    if (/^\d+$/.test(identifier)) {
      document.getElementById('sNisn').value = identifier;
    } else {
      document.getElementById('sNama').value = identifier;
    }
  }
}

// Pratinjau & Kompresi Foto Rumah
function previewImage(input, imgId, key) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // Kompres gambar agar hemat ruang localStorage
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 700;
      const scale = Math.min(1, MAX_WIDTH / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
      tempPhotos[key] = compressedBase64;

      const placeholderId = key === 'depan' ? 'placeholderDepan' : 'placeholderDalam';
      showImagePreview(imgId, placeholderId, compressedBase64);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function showImagePreview(imgId, placeholderId, src) {
  const imgEl = document.getElementById(imgId);
  imgEl.src = src;
  imgEl.classList.remove('hidden');
  document.getElementById(placeholderId).classList.add('hidden');
}

// Ambil Lokasi GPS Otomatis
function ambilLokasiGPS() {
  if (!navigator.geolocation) {
    showToast('Browser tidak mendukung GPS.');
    return;
  }
  showToast('Mengambil titik koordinat...');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      document.getElementById('sKoordinat').value = `${lat}, ${lng}`;
      showToast('Titik GPS berhasil didapatkan!');
    },
    () => {
      document.getElementById('sKoordinat').value = '-7.96662, 112.63263';
      showToast('Menggunakan koordinat simulasi lokasi saat ini.');
    }
  );
}

// Simpan Formulir Siswa
document.getElementById('studentDataForm').addEventListener('submit', function(e) {
  e.preventDefault();

  if (!tempPhotos.depan) {
    showToast('Harap unggah Foto Rumah Tampak Depan terlebih dahulu!');
    return;
  }

  const students = getStudentsData();
  const nisn = document.getElementById('sNisn').value.trim();

  const newRecord = {
    nisn,
    nama: document.getElementById('sNama').value.trim(),
    kelas: document.getElementById('sKelas').value.trim(),
    phone: document.getElementById('sPhone').value.trim(),
    statusKeluarga: document.getElementById('sStatusKeluarga').value,
    ekonomi: document.getElementById('sEkonomi').value,
    pekerjaan: document.getElementById('sPekerjaan').value.trim(),
    tanggungan: parseInt(document.getElementById('sTanggungan').value, 10),
    kepemilikanRumah: document.getElementById('sKepemilikanRumah').value,
    bantuan: document.getElementById('sBantuan').value,
    alamat: document.getElementById('sAlamat').value.trim(),
    kelurahan: document.getElementById('sKelurahan').value.trim(),
    kecamatan: document.getElementById('sKecamatan').value.trim(),
    koordinat: document.getElementById('sKoordinat').value.trim(),
    fotoDepan: tempPhotos.depan,
    fotoDalam: tempPhotos.dalam || tempPhotos.depan,
    statusVerifikasi: 'Menunggu Verifikasi',
    catatanAdmin: ''
  };

  const index = students.findIndex(s => s.nisn === nisn);
  if (index >= 0) {
    students[index] = newRecord;
  } else {
    students.unshift(newRecord);
  }

  saveStudentsData(students);
  showToast('Data ekonomi & foto rumah berhasil dikirim ke Admin!');
});

// ================= LOGIKA HALAMAN ADMIN =================
function renderAdminDashboard() {
  const students = getStudentsData();

  // Hitung KPI
  document.getElementById('statTotal').textContent = students.length;
  document.getElementById('statKurangMampu').textContent = students.filter(s => s.ekonomi === 'Kurang Mampu').length;
  document.getElementById('statYatim').textContent = students.filter(s => ['Yatim', 'Piatu', 'Yatim Piatu'].includes(s.statusKeluarga)).length;
  document.getElementById('statVerified').textContent = students.filter(s => s.statusVerifikasi === 'Terverifikasi').length;

  renderAdminTable();
}

function renderAdminTable() {
  const students = getStudentsData();
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const fEkonomi = document.getElementById('filterEkonomi').value;
  const fKeluarga = document.getElementById('filterKeluarga').value;
  const fStatus = document.getElementById('filterStatus').value;

  const filtered = students.filter(s => {
    const matchText =
      s.nama.toLowerCase().includes(keyword) ||
      s.nisn.includes(keyword) ||
      s.alamat.toLowerCase().includes(keyword) ||
      s.kecamatan.toLowerCase().includes(keyword);
    const matchEkonomi = fEkonomi === 'ALL' || s.ekonomi === fEkonomi;
    const matchKeluarga = fKeluarga === 'ALL' || s.statusKeluarga === fKeluarga;
    const matchStatus = fStatus === 'ALL' || s.statusVerifikasi === fStatus;

    return matchText && matchEkonomi && matchKeluarga && matchStatus;
  });

  const tbody = document.getElementById('adminTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:#64748b;">Tidak ada data siswa yang sesuai dengan filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const ekonomiBadge =
      s.ekonomi === 'Kurang Mampu' ? 'badge-danger' :
      s.ekonomi === 'Menengah Bawah' ? 'badge-warning' : 'badge-info';

    const statusBadge =
      s.statusVerifikasi === 'Terverifikasi' ? 'badge-success' : 'badge-warning';

    return `
      <tr>
        <td>
          <strong>${s.nama}</strong><br>
          <small style="color:#64748b;">NISN: ${s.nisn} • ${s.kelas}</small>
        </td>
        <td>
          <span class="badge ${ekonomiBadge}">${s.ekonomi}</span><br>
          <small style="color:#64748b;">${s.pekerjaan}</small>
        </td>
        <td>
          <strong>${s.statusKeluarga}</strong><br>
          <small style="color:#64748b;">Tanggungan: ${s.tanggungan} orang</small>
        </td>
        <td>
          <span>${s.alamat}</span><br>
          <small style="color:#64748b;">Kel. ${s.kelurahan}, ${s.kecamatan}</small>
        </td>
        <td>
          <img src="${s.fotoDepan}" alt="Foto Rumah" class="thumb-rumah">
        </td>
        <td><span class="badge ${statusBadge}">${s.statusVerifikasi}</span></td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="openDetailModal('${s.nisn}')">
            <i class="fa-solid fa-eye"></i> Periksa
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Modal Detail & Verifikasi Admin
function openDetailModal(nisn) {
  const students = getStudentsData();
  const s = students.find(item => item.nisn === nisn);
  if (!s) return;

  const mapsUrl = s.koordinat
    ? `https://www.google.com/maps?q=${encodeURIComponent(s.koordinat)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.alamat + ' ' + s.kecamatan)}`;

  document.getElementById('modalBody').innerHTML = `
    <div class="detail-grid">
      <div class="detail-item"><label>Nama Lengkap & Kelas</label><p>${s.nama} (${s.kelas})</p></div>
      <div class="detail-item"><label>NISN / WhatsApp</label><p>${s.nisn} / ${s.phone}</p></div>
      <div class="detail-item"><label>Kondisi Ekonomi</label><p>${s.ekonomi} (${s.pekerjaan})</p></div>
      <div class="detail-item"><label>Status Keluarga & Tanggungan</label><p>${s.statusKeluarga} (${s.tanggungan} Tanggungan)</p></div>
      <div class="detail-item"><label>Kepemilikan Rumah & Bantuan</label><p>${s.kepemilikanRumah} • ${s.bantuan}</p></div>
      <div class="detail-item">
        <label>Alamat Domisili Saat Ini</label>
        <p>${s.alamat}, Kel. ${s.kelurahan}, ${s.kecamatan}</p>
        <a href="${mapsUrl}" target="_blank" style="font-size:0.82rem; color:#2563eb; font-weight:600;">
          <i class="fa-solid fa-map-location-dot"></i> Buka Lokasi di Google Maps
        </a>
      </div>
    </div>

    <div>
      <strong style="font-size:0.9rem;">Dokumentasi Kondisi Rumah Terbaru:</strong>
      <div class="modal-photos">
        <div>
          <small style="color:#64748b; display:block; margin-bottom:4px;">Tampak Depan Rumah</small>
          <img src="${s.fotoDepan}" alt="Tampak Depan">
        </div>
        <div>
          <small style="color:#64748b; display:block; margin-bottom:4px;">Bagian Dalam / Ruang Tamu</small>
          <img src="${s.fotoDalam}" alt="Bagian Dalam">
        </div>
      </div>
    </div>

    <div class="form-group" style="margin-top:18px;">
      <label>Catatan Verifikasi / Rekomendasi Bantuan Admin</label>
      <textarea id="adminNoteInput" class="form-control" rows="2" placeholder="Tuliskan hasil verifikasi atau rekomendasi beasiswa...">${s.catatanAdmin || ''}</textarea>
    </div>

    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
      <button class="btn btn-outline-dark" onclick="closeModal()">Tutup</button>
      <button class="btn btn-success" onclick="verifyStudent('${s.nisn}')">
        <i class="fa-solid fa-circle-check"></i> Verifikasi Data Siswa
      </button>
    </div>
  `;

  document.getElementById('detailModal').classList.remove('hidden');
}

function verifyStudent(nisn) {
  const students = getStudentsData();
  const idx = students.findIndex(s => s.nisn === nisn);
  if (idx === -1) return;

  students[idx].statusVerifikasi = 'Terverifikasi';
  students[idx].catatanAdmin = document.getElementById('adminNoteInput').value.trim();
  saveStudentsData(students);

  closeModal();
  renderAdminDashboard();
  showToast(`Data siswa ${students[idx].nama} berhasil diverifikasi!`);
}

function closeModal() {
  document.getElementById('detailModal').classList.add('hidden');
}

function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  renderAdminDashboard();
  showToast('Data demo berhasil dikembalikan ke awal.');
}

// Notifikasi Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3200);
}