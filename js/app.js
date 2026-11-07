/**
 * ======================================================================================
 * AI WEBSITE BUILDER CONTROLLER & CANVAS REAL-TIME RENDERER
 * ======================================================================================
 * Dilengkapi fitur interaktif Drag & Drop dan Form Pintar Beradaptasi (Context-Aware Form):
 * 1. Setiap jenis bagian (HERO, ABOUT, CATALOG, CONTACT, FOOTER) memiliki:
 *    - Label spesifik
 *    - Placeholder / petunjuk pengisian khusus
 *    - Keterangan bantuan (helper text) yang jelas dan mudah dipahami siapa saja (tanpa perlu tahu koding)
 *    - Bidang khusus untuk CONTACT: Nomor WhatsApp/Telepon, Alamat Lengkap, dan Jam Buka
 * 2. Drag & drop item produk dari Palet Samping ke kanvas
 * 3. Proteksi try...catch di seluruh operasi
 * ======================================================================================
 */

// Kredensial Otentikasi Demo Tunggal (AC-2.2)
const DEMO_CREDENTIALS = {
  email: 'pemilik@umkm.id',
  password: 'demo123'
};

// State Aplikasi Global
const APP_STATE = {
  isEditorMode: true,
  isSidebarOpen: true,
  isAiDockOpen: true,
  isAiProcessing: false,
  currentUser: null,
  activeTab: 'ITEMS',
  draggedData: null
};

/**
 * METADATA FORM PINTAR BERADAPTASI UNTUK SETIAP JENIS BAGIAN WEBSITE
 * Memenuhi kebutuhan siapa saja yang ingin membuat website secara instan tanpa perlu skill koding agar setiap kolom memiliki petunjuk yang tepat.
 */
const SECTION_TYPE_METADATA = {
  NAVBAR: {
    name: 'Header Navigasi (Navbar)',
    tip: 'Bilah menu navigasi di bagian atas website. Anda dapat mengatur setiap tautan menu dengan memilih bagian yang dituju lewat dropdown agar otomatis scroll langsung ke bagian tersebut saat diklik.',
    title: {
      label: 'Nama Usaha / Merk di Navbar',
      placeholder: 'Contoh: Dapoer Berkah Nusantara',
      helper: 'Nama toko atau merk utama yang tampil di sebelah kiri bar navigasi'
    },
    subtitle: {
      label: 'Teks Tombol Aksi Kanan (CTA Button)',
      placeholder: 'Contoh: Hubungi Kami',
      helper: 'Tombol aksi khusus di ujung kanan navbar (misal: "Hubungi Kami" atau "Pesan Sekarang")'
    },
    content: {
      label: 'Daftar Menu Navigasi (Tersinkronisasi Otomatis)',
      placeholder: 'Dikelola otomatis melalui daftar dropdown di atas',
      helper: 'Daftar menu diatur otomatis sesuai baris dan dropdown tujuan di atas'
    }
  },
  HERO: {
    name: 'Banner Sambutan (Hero)',
    tip: 'Bagian paling atas website untuk memperkenalkan nama toko, slogan utama, dan menarik perhatian pembeli pertama kali.',
    title: {
      label: 'Nama Usaha / Merk Toko',
      placeholder: 'Contoh: Dapoer Berkah Nusantara',
      helper: 'Nama toko atau brand utama yang akan tampil besar dan mencolok di bagian atas'
    },
    subtitle: {
      label: 'Slogan / Keunggulan Utama',
      placeholder: 'Contoh: Masakan Tradisional Gurih & Asli Resep Warisan Nenek Sejak 1988',
      helper: 'Kalimat pendek pemikat yang menjelaskan apa yang membuat toko Anda istimewa'
    },
    content: {
      label: 'Deskripsi Sambutan untuk Pengunjung',
      placeholder: 'Contoh: Kami menghadirkan aneka masakan Nusantara dengan bahan pilihan segar dari pasar lokal dan rempah alami terbaik. Higienis, terjangkau, dan lezat untuk keluarga Anda.',
      helper: 'Perkenalan 1–2 kalimat menyambut pelanggan baru di website Anda'
    }
  },
  ABOUT: {
    name: 'Tentang Kami (Cerita Usaha)',
    tip: 'Ceritakan kisah awal mula usaha Anda, keaslian resep, komitmen kebersihan, atau pengalaman bertahun-tahun untuk membangun kepercayaan pembeli.',
    title: {
      label: 'Judul Cerita Usaha',
      placeholder: 'Contoh: Tentang Dapoer Berkah',
      helper: 'Judul untuk memperkenalkan profil atau latar belakang usaha Anda'
    },
    subtitle: {
      label: 'Pengalaman / Tahun Berdiri',
      placeholder: 'Contoh: Kisah Kami Melayani Selera Nusantara Selama Lebih Dari 30 Tahun',
      helper: 'Pencapaian waktu atau komitmen yang membanggakan dari usaha Anda'
    },
    content: {
      label: 'Kisah Lengkap & Komitmen Rasa',
      placeholder: 'Contoh: Berawal dari warung makan sederhana di sudut pasar tradisional, kini Dapoer Berkah melayani ribuan porsi setiap bulan untuk pesanan harian, arisan, syukuran, dan katering kantor. Komitmen kami tetap sama: rasa rumahan yang otentik dan harga yang bersahabat bagi siapa saja.',
      helper: 'Tuliskan sejarah singkat, dedikasi rasa, atau komitmen bahan alami yang Anda jaga'
    }
  },
  CATALOG: {
    name: 'Katalog Menu & Produk',
    tip: 'Etalase daftar menu makanan atau produk yang Anda jual. Item di dalamnya bisa ditambah/dihapus lewat Drag & Drop di palet samping.',
    title: {
      label: 'Judul Daftar Menu / Produk',
      placeholder: 'Contoh: Daftar Menu & Produk Favorit',
      helper: 'Nama judul untuk etalase menu atau hidangan yang Anda tawarkan'
    },
    subtitle: {
      label: 'Subjudul / Ajakan Menikmati Menu',
      placeholder: 'Contoh: Pilihan hidangan lezat yang paling sering dipesan oleh pelanggan setia kami',
      helper: 'Kalimat pemikat agar pembeli tergiur untuk memilih menu'
    },
    content: {
      label: 'Catatan Penyajian / Keterangan Porsi',
      placeholder: 'Contoh: Semua masakan diolah setiap pagi tanpa bahan pengawet. Tersedia porsi perorangan maupun paket katering nasi kotak.',
      helper: 'Informasi tambahan seputar bahan segar, ketersediaan porsi, atau kemasan'
    }
  },
  CONTACT: {
    name: 'Kontak WhatsApp & Lokasi Toko',
    tip: 'Bagian krusial untuk memudahkan pembeli menghubungi nomor WhatsApp Anda secara langsung dan menemukan alamat toko fisik.',
    title: {
      label: 'Judul Layanan Kontak',
      placeholder: 'Contoh: Hubungi Kami & Pemesanan',
      helper: 'Judul untuk pusat pesanan dan tanya jawab pelanggan'
    },
    subtitle: {
      label: 'Keterangan Kesiapan Pesanan',
      placeholder: 'Contoh: Siap melayani pesanan katering, prasmanan, dan nasi kotak',
      helper: 'Kesiapan melayani pesanan, arisan, atau pengantaran langsung'
    },
    content: {
      label: 'Ringkasan Format Kontak Kanvas (Otomatis Terisi)',
      placeholder: 'Contoh: WhatsApp: 0812-3456-7890 | Alamat: Jl. Kenanga No. 24, Pasar Minggu | Buka setiap hari: 08.00 - 20.00 WIB',
      helper: 'Teks ini otomatis tersusun rapi dari nomor telepon, alamat, dan jam buka di atas'
    }
  },
  FOOTER: {
    name: 'Catatan Kaki (Footer)',
    tip: 'Bagian paling dasar website untuk menampilkan identitas nama toko, hak cipta resmi, dan ucapan penutup yang sopan.',
    title: {
      label: 'Nama Usaha / Merk Resmi di Bagian Bawah',
      placeholder: 'Contoh: Dapoer Berkah Nusantara',
      helper: 'Nama brand yang akan tampil di baris penutup halaman'
    },
    subtitle: {
      label: 'Teks Hak Cipta (Copyright)',
      placeholder: 'Contoh: Hak Cipta © 2026 Dapoer Berkah. Seluruh hak cipta dilindungi undang-undang.',
      helper: 'Tahun aktif dan status kepemilikan resmi usaha Anda'
    },
    content: {
      label: 'Slogan Penutup / Pesan Pelanggan',
      placeholder: 'Contoh: Maju bersama UMKM Indonesia. Rasa otentik warisan keluarga.',
      helper: 'Pesan hangat penutup untuk pengunjung yang membaca sampai akhir'
    }
  }
};

// Helper untuk mengambil instance InMemoryStore secara aman
function getStore() {
  try {
    if (typeof window !== 'undefined' && window.appStore) return window.appStore;
    if (typeof appStore !== 'undefined') return appStore;
    return null;
  } catch (e) {
    console.error('Error getStore:', e);
    return null;
  }
}

// ======================================================================================
// 1. SISTEM NOTIFIKASI TOAST (TRY...CATCH SAFE)
// ======================================================================================
function showToast(message, type = 'info', durationMs = 3500) {
  try {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-animate pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border text-sm text-white transition-all transform ${
      type === 'success' ? 'bg-emerald-700 border-emerald-600' :
      type === 'error' ? 'bg-rose-700 border-rose-600' :
      type === 'warning' ? 'bg-amber-700 border-amber-600' :
      'bg-slate-800 border-slate-700'
    }`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';
    if (type === 'warning') iconName = 'alert-circle';

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
      <div class="flex-1 font-medium leading-relaxed">${message}</div>
      <button class="text-white/80 hover:text-white ml-2" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) {
      window.lucide.createIcons();
    }

    setTimeout(() => {
      try {
        if (toast && toast.parentElement) {
          toast.remove();
        }
      } catch (e) {
        console.error('Error saat remove toast:', e);
      }
    }, durationMs);

  } catch (err) {
    console.error('Error saat showToast:', err);
  }
}

// ======================================================================================
// 2. OTENTIKASI & SESI PROTOTIPE (PRD AC-2.1, AC-2.2, AC-2.3, AC-2.4)
// ======================================================================================
function initAuthentication() {
  try {
    const loginForm = document.getElementById('loginForm');
    const loginScreen = document.getElementById('loginScreen');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginErrorAlert = document.getElementById('loginErrorAlert');
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    const btnQuickFillLogin = document.getElementById('btnQuickFillLogin');
    const btnLogout = document.getElementById('btnLogout');

    let activeSession = sessionStorage.getItem('ai_builder_active_session');
    if (!activeSession) {
      activeSession = JSON.stringify({
        email: DEMO_CREDENTIALS.email,
        role: 'OWNER_UMKM',
        loginTime: new Date().toISOString()
      });
      sessionStorage.setItem('ai_builder_active_session', activeSession);
    }
    
    APP_STATE.currentUser = JSON.parse(activeSession);
    if (loginScreen) loginScreen.classList.add('hidden');

    if (btnQuickFillLogin) {
      btnQuickFillLogin.addEventListener('click', () => {
        try {
          loginEmail.value = DEMO_CREDENTIALS.email;
          loginPassword.value = DEMO_CREDENTIALS.password;
          loginErrorAlert.classList.add('hidden');
        } catch (e) {
          console.error('Error quick fill:', e);
        }
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        try {
          e.preventDefault();
          const emailVal = (loginEmail.value || '').trim().toLowerCase();
          const passVal = (loginPassword.value || '').trim();

          if (emailVal === DEMO_CREDENTIALS.email.toLowerCase() && passVal === DEMO_CREDENTIALS.password) {
            const sessionData = {
              email: emailVal,
              role: 'OWNER_UMKM',
              loginTime: new Date().toISOString()
            };
            sessionStorage.setItem('ai_builder_active_session', JSON.stringify(sessionData));
            APP_STATE.currentUser = sessionData;

            loginErrorAlert.classList.add('hidden');
            loginScreen.classList.add('hidden');
            showToast('Selamat datang di Canvas Website Builder!', 'success');
            renderSidebar();
            renderCanvas();
          } else {
            loginErrorAlert.classList.remove('hidden');
            loginErrorMessage.textContent = 'Email atau kata sandi tidak sesuai. Silakan gunakan kredensial demo.';
          }
        } catch (err) {
          console.error('Error saat submit login:', err);
          showToast('Terjadi gangguan saat memproses login.', 'error');
        }
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        try {
          sessionStorage.removeItem('ai_builder_active_session');
          APP_STATE.currentUser = null;
          if (loginScreen) loginScreen.classList.remove('hidden');
          showToast('Anda telah keluar dari sesi editor.', 'info');
        } catch (e) {
          console.error('Error saat logout:', e);
        }
      });
    }

  } catch (err) {
    console.error('Error saat inisialisasi otentikasi:', err);
  }
}

// ======================================================================================

// ======================================================================================
// NAV LINKS EDITOR & INTERACTIVE SECTION NAVIGATION
// ======================================================================================
let ADD_NAV_LINKS = [
  { label: 'Beranda', target: '#hero' },
  { label: 'Tentang Kami', target: '#about' },
  { label: 'Daftar Menu', target: '#catalog' },
  { label: 'Kontak', target: '#contact' }
];

let EDIT_NAV_LINKS = [];

function renderNavLinksEditor(prefix) {
  try {
    const container = document.getElementById(`${prefix}NavItemsList`);
    if (!container) return;

    let links = prefix === 'add' ? ADD_NAV_LINKS : EDIT_NAV_LINKS;
    if (!Array.isArray(links) || links.length === 0) {
      links = [
        { label: 'Beranda', target: '#hero' },
        { label: 'Tentang Kami', target: '#about' },
        { label: 'Daftar Menu', target: '#catalog' },
        { label: 'Kontak', target: '#contact' }
      ];
      if (prefix === 'add') ADD_NAV_LINKS = links;
      else EDIT_NAV_LINKS = links;
    }

    container.innerHTML = '';

    // Ambil daftar bagian aktual yang sedang ada di kanvas secara real-time
    const store = getStore();
    const sortedSections = store ? store.getSortedSections() : [];

    // Hitung frekuensi tipe bagian untuk memberi label pembeda jika ada multiple
    const typeCounts = {};
    sortedSections.forEach(s => {
      typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
    });

    const typeIndices = {};
    const dynamicTargetOptions = [];

    // Filter keluar NAVBAR (navigasi ke navbar sendiri tidak dibutuhkan)
    sortedSections.filter(s => s.type !== 'NAVBAR').forEach(s => {
      typeIndices[s.type] = (typeIndices[s.type] || 0) + 1;
      const typeIdx = typeIndices[s.type];
      const countOfType = typeCounts[s.type] || 1;

      let distinction = '';
      if (countOfType > 1) {
        distinction = ` #${typeIdx}`;
      }

      const titleSnippet = s.title ? ` - "${s.title}"` : '';

      dynamicTargetOptions.push({
        value: `#section-${s.id}`,
        sectionId: s.id,
        sectionType: s.type,
        isFirst: typeIdx === 1,
        label: `[#${s.orderIndex}] ${s.type}${distinction}${titleSnippet}`
      });
    });

    // Fallback jika belum ada bagian di kanvas
    if (dynamicTargetOptions.length === 0) {
      dynamicTargetOptions.push(
        { value: '#hero', sectionType: 'HERO', isFirst: true, label: 'HERO - Banner Sambutan' },
        { value: '#about', sectionType: 'ABOUT', isFirst: true, label: 'ABOUT - Profil Usaha' },
        { value: '#catalog', sectionType: 'CATALOG', isFirst: true, label: 'CATALOG - Katalog Menu & Produk' },
        { value: '#contact', sectionType: 'CONTACT', isFirst: true, label: 'CONTACT - Kontak WhatsApp' },
        { value: '#footer', sectionType: 'FOOTER', isFirst: true, label: 'FOOTER - Catatan Kaki' }
      );
    }

    links.forEach((link, idx) => {
      const row = document.createElement('div');
      row.className = 'nav-item-row flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs';

      // Cocokkan link.target dengan option dinamis
      let selectedVal = link.target;
      const directMatch = dynamicTargetOptions.find(opt => opt.value === link.target);
      if (!directMatch) {
        // Jika target berformat lama (misal: '#hero', '#catalog'), arahkan ke section pertama yang cocok
        const cleanType = (link.target || '').replace(/^#section-/, '').replace(/^#/, '').toUpperCase();
        const typeMatch = dynamicTargetOptions.find(opt => opt.sectionType === cleanType && opt.isFirst) ||
                          dynamicTargetOptions.find(opt => opt.sectionType === cleanType);
        if (typeMatch) {
          selectedVal = typeMatch.value;
          link.target = typeMatch.value; // sinkronkan target ke ID spesifik
        } else if (dynamicTargetOptions.length > 0) {
          selectedVal = dynamicTargetOptions[0].value;
          link.target = dynamicTargetOptions[0].value;
        }
      }

      const optionsHtml = dynamicTargetOptions.map(opt => `
        <option value="${opt.value}" ${opt.value === selectedVal ? 'selected' : ''}>
          ${escapeHtml(opt.label)}
        </option>
      `).join('');

      row.innerHTML = `
        <span class="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          ${idx + 1}
        </span>
        <div class="flex-1 min-w-0">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Nama Menu</label>
          <input 
            type="text" 
            value="${escapeHtml(link.label || '')}" 
            placeholder="Misal: Beranda" 
            class="nav-input-label w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
        </div>
        <div class="flex-1 min-w-0">
          <label class="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Tujuan Halaman (Dropdown)</label>
          <select class="nav-select-target w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500">
            ${optionsHtml}
          </select>
        </div>
        <button 
          type="button" 
          class="btn-remove-nav-row mt-3.5 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" 
          title="Hapus menu ini"
        >
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      `;

      const labelInput = row.querySelector('.nav-input-label');
      if (labelInput) {
        labelInput.addEventListener('input', (e) => {
          links[idx].label = e.target.value;
          syncNavLinksToContent(prefix);
        });
      }

      const targetSelect = row.querySelector('.nav-select-target');
      if (targetSelect) {
        targetSelect.addEventListener('change', (e) => {
          links[idx].target = e.target.value;
          syncNavLinksToContent(prefix);
        });
      }

      const btnRemove = row.querySelector('.btn-remove-nav-row');
      if (btnRemove) {
        btnRemove.addEventListener('click', () => {
          links.splice(idx, 1);
          renderNavLinksEditor(prefix);
          syncNavLinksToContent(prefix);
        });
      }

      container.appendChild(row);
    });

    syncNavLinksToContent(prefix);
    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error('Error renderNavLinksEditor:', err);
  }
}

function syncNavLinksToContent(prefix) {
  try {
    const links = prefix === 'add' ? ADD_NAV_LINKS : EDIT_NAV_LINKS;
    const contentInput = document.getElementById(`${prefix}SectionContent`);
    if (contentInput) {
      contentInput.value = JSON.stringify(links);
    }
  } catch (err) {
    console.error('Error syncNavLinksToContent:', err);
  }
}

window.handleNavigateToSection = function(targetSelector) {
  try {
    if (!targetSelector) return;
    const rawTarget = targetSelector.trim();
    const cleanId = rawTarget.replace(/^#/, '');

    // 1. Cari exact matching ID (misal: "section-sec_123", "sec_123", dll)
    let targetEl = document.getElementById(cleanId) || 
                   document.getElementById(`section-${cleanId}`) || 
                   document.querySelector(`[data-id="${cleanId}"]`) || 
                   document.querySelector(`[data-id="${cleanId.replace(/^section-/, '')}"]`);

    // 2. Jika tidak ditemukan, cari berdasarkan data-type (misal jika targetSelector adalah '#hero' atau '#catalog')
    if (!targetEl) {
      const typeUpper = cleanId.replace(/^section-/, '').toUpperCase();
      targetEl = document.querySelector(`[data-type="${typeUpper}"]`);
    }

    // 3. Fallback querySelector langsung
    if (!targetEl && rawTarget.startsWith('#')) {
      try {
        targetEl = document.querySelector(rawTarget);
      } catch (e) {
        // Abaikan selector invalid
      }
    }

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight visual penanda bagian yang dituju dengan pulsing ring
      targetEl.classList.remove('ring-4', 'ring-indigo-500/70', 'ring-offset-2');
      void targetEl.offsetWidth; // force reflow
      targetEl.classList.add('ring-4', 'ring-indigo-500/70', 'ring-offset-2', 'transition-all', 'duration-300');

      const secType = targetEl.getAttribute('data-type') || 'BAGIAN';
      const order = targetEl.getAttribute('data-order') || '';
      showToast(`Membuka bagian #${order} (${secType})`, 'info', 1500);

      setTimeout(() => {
        targetEl.classList.remove('ring-4', 'ring-indigo-500/70', 'ring-offset-2');
      }, 1800);
    } else {
      console.warn('Bagian target navigasi tidak ditemukan di kanvas:', targetSelector);
      showToast(`Bagian ${cleanId} tidak ditemukan di kanvas saat ini.`, 'warning', 2000);
    }
  } catch (err) {
    console.error('Error handleNavigateToSection:', err);
  }
};

// 3. FUNGSI ADAPTASI FORM PINTAR (UPDATE HINT & FIELD SESUAI TIPE BAGIAN)
// ======================================================================================
function updateSectionFormFields(prefix, sectionType) {
  try {
    const cleanType = (sectionType || 'ABOUT').toUpperCase();
    const meta = SECTION_TYPE_METADATA[cleanType] || SECTION_TYPE_METADATA.ABOUT;

    // 1. Update Petunjuk Tip Box
    const tipText = document.getElementById(`${prefix}SectionTipText`);
    if (tipText) {
      tipText.textContent = meta.tip;
    }

    // 2. Update Label, Helper, dan Placeholder Judul
    const titleLabel = document.getElementById(`${prefix}TitleLabel`);
    const titleHelper = document.getElementById(`${prefix}TitleHelper`);
    const titleInput = document.getElementById(`${prefix}SectionTitle`);
    if (titleLabel) titleLabel.textContent = meta.title.label;
    if (titleHelper) titleHelper.textContent = meta.title.helper;
    if (titleInput) titleInput.placeholder = meta.title.placeholder;

    // 3. Update Label, Helper, dan Placeholder Subjudul
    const subLabel = document.getElementById(`${prefix}SubtitleLabel`);
    const subHelper = document.getElementById(`${prefix}SubtitleHelper`);
    const subInput = document.getElementById(`${prefix}SectionSubtitle`);
    if (subLabel) subLabel.textContent = meta.subtitle.label;
    if (subHelper) subHelper.textContent = meta.subtitle.helper;
    if (subInput) subInput.placeholder = meta.subtitle.placeholder;

    // 4. Update Label, Helper, dan Placeholder Isi Teks
    const contentLabel = document.getElementById(`${prefix}ContentLabel`);
    const contentHelper = document.getElementById(`${prefix}ContentHelper`);
    const contentInput = document.getElementById(`${prefix}SectionContent`);
    const contentGroup = document.getElementById(`${prefix}ContentGroup`);
    if (contentLabel) contentLabel.textContent = meta.content.label;
    if (contentHelper) contentHelper.textContent = meta.content.helper;
    if (contentInput) contentInput.placeholder = meta.content.placeholder;

    // Hapus residu string JSON jika beralih dari NAVBAR ke tipe bagian lain
    if (cleanType !== 'NAVBAR' && contentInput) {
      const val = (contentInput.value || '').trim();
      if (val.startsWith('[') || val.startsWith('{"')) {
        contentInput.value = '';
      }
    }

    // 5. Penanganan Khusus Tipe CONTACT (Menampilkan input Telepon, Alamat, dan Jam Buka)
    const contactBox = document.getElementById(`${prefix}ContactBox`);
    if (contactBox) {
      if (cleanType === 'CONTACT') {
        contactBox.classList.remove('hidden');
        setupContactFieldSync(prefix);
      } else {
        contactBox.classList.add('hidden');
      }
    }

    // 6. Penanganan Khusus Tipe NAVBAR (Menampilkan konfigurasi menu navigasi dengan dropdown tujuan)
    const navBox = document.getElementById(`${prefix}NavBox`);
    if (navBox) {
      if (cleanType === 'NAVBAR') {
        navBox.classList.remove('hidden');
        if (contentGroup) contentGroup.classList.add('hidden');
        renderNavLinksEditor(prefix);
      } else {
        navBox.classList.add('hidden');
        if (contentGroup) contentGroup.classList.remove('hidden');
      }
    }

    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error('Error di updateSectionFormFields:', err);
  }
}

// Helper untuk menyinkronkan sub-field kontak ke dalam satu teks content yang rapi
function setupContactFieldSync(prefix) {
  try {
    const phoneInput = document.getElementById(`${prefix}ContactPhone`);
    const addrInput = document.getElementById(`${prefix}ContactAddress`);
    const hoursInput = document.getElementById(`${prefix}ContactHours`);
    const contentTextarea = document.getElementById(`${prefix}SectionContent`);

    function syncToContent() {
      try {
        const phone = (phoneInput?.value || '').trim();
        const addr = (addrInput?.value || '').trim();
        const hours = (hoursInput?.value || '').trim();

        const parts = [];
        if (phone) parts.push(`WhatsApp: ${phone}`);
        if (addr) parts.push(`Alamat: ${addr}`);
        if (hours) parts.push(`Buka: ${hours}`);

        if (contentTextarea && parts.length > 0) {
          contentTextarea.value = parts.join(' | ');
        }
      } catch (e) {
        console.error('Error syncToContent:', e);
      }
    }

    if (phoneInput && !phoneInput.dataset.hasSync) {
      phoneInput.addEventListener('input', syncToContent);
      phoneInput.dataset.hasSync = 'true';
    }
    if (addrInput && !addrInput.dataset.hasSync) {
      addrInput.addEventListener('input', syncToContent);
      addrInput.dataset.hasSync = 'true';
    }
    if (hoursInput && !hoursInput.dataset.hasSync) {
      hoursInput.addEventListener('input', syncToContent);
      hoursInput.dataset.hasSync = 'true';
    }
  } catch (err) {
    console.error('Error setupContactFieldSync:', err);
  }
}

// Mengurai teks content kontak yang ada untuk mengisi field terpisah di modal edit
function parseContactContentToFields(prefix, rawContent) {
  try {
    if (!rawContent) return;
    const phoneInput = document.getElementById(`${prefix}ContactPhone`);
    const addrInput = document.getElementById(`${prefix}ContactAddress`);
    const hoursInput = document.getElementById(`${prefix}ContactHours`);

    // Ekstrak WhatsApp / Telepon
    const phoneMatch = rawContent.match(/(?:WhatsApp|WA|Telepon|Telp|No\.?):\s*([^|]+)/i);
    if (phoneMatch && phoneInput) {
      phoneInput.value = phoneMatch[1].trim();
    }

    // Ekstrak Alamat
    const addrMatch = rawContent.match(/(?:Alamat|Lokasi):\s*([^|]+)/i);
    if (addrMatch && addrInput) {
      addrInput.value = addrMatch[1].trim();
    }

    // Ekstrak Jam Buka
    const hoursMatch = rawContent.match(/(?:Buka|Jam|Jadwal):\s*([^|]+)/i);
    if (hoursMatch && hoursInput) {
      hoursInput.value = hoursMatch[1].trim();
    }
  } catch (err) {
    console.error('Error parseContactContentToFields:', err);
  }
}

// ======================================================================================
// 3C. SISTEM KUSTOMISASI GAYA WEBSITE (WARNA & FONT REAL-TIME)
// ======================================================================================
function initThemeSettings() {
  try {
    const store = getStore();
    if (!store) return;

    const modalThemeSettings = document.getElementById('modalThemeSettings');
    const btnThemeSettings = document.getElementById('btnThemeSettings');
    const btnResetThemeDefault = document.getElementById('btnResetThemeDefault');
    const btnSaveThemeModal = document.getElementById('btnSaveThemeModal');
    const presetsContainer = document.getElementById('themePresetsContainer');

    const pickerBg = document.getElementById('pickerBgColor');
    const hexBg = document.getElementById('hexBgColor');
    const pickerPrimary = document.getElementById('pickerPrimaryColor');
    const hexPrimary = document.getElementById('hexPrimaryColor');
    const pickerHeading = document.getElementById('pickerHeadingColor');
    const hexHeading = document.getElementById('hexHeadingColor');
    const pickerText = document.getElementById('pickerTextColor');
    const hexText = document.getElementById('hexTextColor');

    const selectHeadingFont = document.getElementById('themeHeadingFontSelect');
    const selectBodyFont = document.getElementById('themeBodyFontSelect');

    const presets = window.THEME_PRESETS || {};

    // 1. Render Preset Theme Cards
    function renderPresetCards() {
      if (!presetsContainer) return;
      presetsContainer.innerHTML = '';
      const activeTheme = store.getTheme ? store.getTheme() : store.getDefaultTheme();

      Object.values(presets).forEach(preset => {
        const isActive = activeTheme.presetId === preset.id || 
          (activeTheme.primaryColor === preset.primaryColor && activeTheme.backgroundColor === preset.backgroundColor);

        const card = document.createElement('div');
        card.className = `theme-preset-card flex flex-col justify-between ${isActive ? 'is-active' : ''}`;
        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-800">${escapeHtml(preset.name)}</span>
              ${preset.badge ? `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">${escapeHtml(preset.badge)}</span>` : ''}
            </div>
            <p class="text-[11px] text-slate-500 mb-2 leading-tight">${escapeHtml(preset.description)}</p>
          </div>
          <div>
            <div class="flex items-center gap-1.5 mb-2">
              <span class="w-5 h-5 rounded-full border border-white shadow-sm flex-shrink-0" style="background-color: ${preset.primaryColor};" title="Warna Tombol"></span>
              <span class="w-5 h-5 rounded-full border border-white shadow-sm flex-shrink-0" style="background-color: ${preset.secondaryColor};" title="Aksen"></span>
              <span class="w-5 h-5 rounded-full border border-slate-300 shadow-sm flex-shrink-0" style="background-color: ${preset.backgroundColor};" title="Latar"></span>
              <span class="w-5 h-5 rounded-full border border-slate-300 shadow-sm flex-shrink-0" style="background-color: ${preset.headingColor};" title="Font Judul"></span>
            </div>
            <div class="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-1.5">
              <span>Font: <strong>${preset.headingFont}</strong></span>
              <span class="text-emerald-700 font-bold">${isActive ? '✓ Aktif' : 'Pilih'}</span>
            </div>
          </div>
        `;

        card.addEventListener('click', () => {
          try {
            store.updateTheme({
              ...preset,
              presetId: preset.id
            });
            syncInputsWithTheme(preset);
            renderCanvas();
            renderPresetCards();
            showToast(`Tema diterapkan: ${preset.name}`, 'success', 2000);
          } catch (e) {
            console.error('Error saat memilih preset tema:', e);
          }
        });

        presetsContainer.appendChild(card);
      });
    }

    // 2. Sinkronkan nilai input di modal dengan tema saat ini
    function syncInputsWithTheme(theme) {
      if (!theme) theme = store.getTheme ? store.getTheme() : store.getDefaultTheme();
      if (pickerBg) pickerBg.value = theme.backgroundColor || '#ffffff';
      if (hexBg) hexBg.value = (theme.backgroundColor || '#ffffff').toUpperCase();

      if (pickerPrimary) pickerPrimary.value = theme.primaryColor || '#15803d';
      if (hexPrimary) hexPrimary.value = (theme.primaryColor || '#15803d').toUpperCase();

      if (pickerHeading) pickerHeading.value = theme.headingColor || '#0f172a';
      if (hexHeading) hexHeading.value = (theme.headingColor || '#0f172a').toUpperCase();

      if (pickerText) pickerText.value = theme.textColor || '#334155';
      if (hexText) hexText.value = (theme.textColor || '#334155').toUpperCase();

      if (selectHeadingFont && theme.headingFont) selectHeadingFont.value = theme.headingFont;
      if (selectBodyFont && theme.bodyFont) selectBodyFont.value = theme.bodyFont;
    }

    // Helper untuk update satu properti tema secara instan ke kanvas
    function applyColorUpdate(key, value) {
      if (!value) return;
      const cleanVal = value.startsWith('#') ? value : `#${value}`;
      store.updateTheme({ [key]: cleanVal });
      renderCanvas();
    }

    // 3. Event Listener Color Pickers & Hex Inputs
    if (pickerBg) {
      pickerBg.addEventListener('input', (e) => {
        if (hexBg) hexBg.value = e.target.value.toUpperCase();
        applyColorUpdate('backgroundColor', e.target.value);
      });
    }
    if (hexBg) {
      hexBg.addEventListener('change', (e) => {
        let v = e.target.value.trim();
        if (!v.startsWith('#')) v = `#${v}`;
        if (pickerBg) pickerBg.value = v;
        applyColorUpdate('backgroundColor', v);
      });
    }

    if (pickerPrimary) {
      pickerPrimary.addEventListener('input', (e) => {
        if (hexPrimary) hexPrimary.value = e.target.value.toUpperCase();
        applyColorUpdate('primaryColor', e.target.value);
      });
    }
    if (hexPrimary) {
      hexPrimary.addEventListener('change', (e) => {
        let v = e.target.value.trim();
        if (!v.startsWith('#')) v = `#${v}`;
        if (pickerPrimary) pickerPrimary.value = v;
        applyColorUpdate('primaryColor', v);
      });
    }

    if (pickerHeading) {
      pickerHeading.addEventListener('input', (e) => {
        if (hexHeading) hexHeading.value = e.target.value.toUpperCase();
        applyColorUpdate('headingColor', e.target.value);
      });
    }
    if (hexHeading) {
      hexHeading.addEventListener('change', (e) => {
        let v = e.target.value.trim();
        if (!v.startsWith('#')) v = `#${v}`;
        if (pickerHeading) pickerHeading.value = v;
        applyColorUpdate('headingColor', v);
      });
    }

    if (pickerText) {
      pickerText.addEventListener('input', (e) => {
        if (hexText) hexText.value = e.target.value.toUpperCase();
        applyColorUpdate('textColor', e.target.value);
      });
    }
    if (hexText) {
      hexText.addEventListener('change', (e) => {
        let v = e.target.value.trim();
        if (!v.startsWith('#')) v = `#${v}`;
        if (pickerText) pickerText.value = v;
        applyColorUpdate('textColor', v);
      });
    }

    // 4. Color Swatches Dots click
    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const target = btn.dataset.target;
          const color = btn.dataset.color;
          if (target === 'BgColor') {
            if (pickerBg) pickerBg.value = color;
            if (hexBg) hexBg.value = color.toUpperCase();
            applyColorUpdate('backgroundColor', color);
          } else if (target === 'PrimaryColor') {
            if (pickerPrimary) pickerPrimary.value = color;
            if (hexPrimary) hexPrimary.value = color.toUpperCase();
            applyColorUpdate('primaryColor', color);
          } else if (target === 'HeadingColor') {
            if (pickerHeading) pickerHeading.value = color;
            if (hexHeading) hexHeading.value = color.toUpperCase();
            applyColorUpdate('headingColor', color);
          } else if (target === 'TextColor') {
            if (pickerText) pickerText.value = color;
            if (hexText) hexText.value = color.toUpperCase();
            applyColorUpdate('textColor', color);
          }
        } catch (e) {
          console.error('Error click swatch:', e);
        }
      });
    });

    // 5. Font Dropdowns change
    if (selectHeadingFont) {
      selectHeadingFont.addEventListener('change', (e) => {
        try {
          store.updateTheme({ headingFont: e.target.value });
          renderCanvas();
          showToast(`Font judul diubah ke: ${e.target.value}`, 'info', 1500);
        } catch (e) {
          console.error('Error selectHeadingFont:', e);
        }
      });
    }

    if (selectBodyFont) {
      selectBodyFont.addEventListener('change', (e) => {
        try {
          store.updateTheme({ bodyFont: e.target.value });
          renderCanvas();
          showToast(`Font isi teks diubah ke: ${e.target.value}`, 'info', 1500);
        } catch (e) {
          console.error('Error selectBodyFont:', e);
        }
      });
    }

    // 6. Buka Modal Tema
    if (btnThemeSettings && modalThemeSettings) {
      btnThemeSettings.addEventListener('click', () => {
        try {
          const currentTheme = store.getTheme ? store.getTheme() : store.getDefaultTheme();
          syncInputsWithTheme(currentTheme);
          renderPresetCards();
          modalThemeSettings.classList.remove('hidden');
        } catch (e) {
          console.error('Error open modalThemeSettings:', e);
        }
      });
    }

    // 7. Simpan / Tutup Modal Tema
    if (btnSaveThemeModal && modalThemeSettings) {
      btnSaveThemeModal.addEventListener('click', () => {
        try {
          modalThemeSettings.classList.add('hidden');
          showToast('Pengaturan gaya & tema website berhasil diterapkan!', 'success');
        } catch (e) {
          console.error('Error save theme modal:', e);
        }
      });
    }

    // 8. Reset ke Tema Awal
    if (btnResetThemeDefault) {
      btnResetThemeDefault.addEventListener('click', () => {
        try {
          if (confirm('Kembalikan warna dan jenis font website ke tema awal?')) {
            const res = store.resetTheme ? store.resetTheme() : { success: true, theme: store.getDefaultTheme() };
            syncInputsWithTheme(res.theme);
            renderPresetCards();
            renderCanvas();
            showToast('Tema website telah dikembalikan ke kondisi awal (Hijau Nusantara).', 'info');
          }
        } catch (e) {
          console.error('Error reset theme default:', e);
        }
      });
    }

    // Render presets pertama kali
    renderPresetCards();

  } catch (err) {
    console.error('Error saat initThemeSettings:', err);
  }
}

// ======================================================================================
// 3D. SISTEM GAYA DESAIN TEMPLATE WEBSITE (LAYOUT & REKOMENDASI TAMPILAN)
// ======================================================================================
function initDesignTemplates() {
  try {
    const store = getStore();
    if (!store) return;

    const modal = document.getElementById('modalDesignTemplates');
    const btnOpen = document.getElementById('btnDesignTemplates');
    const container = document.getElementById('designTemplatesContainer');
    const btnApplyRecommended = document.getElementById('btnApplyRecommendedTemplate');
    const btnResetDefault = document.getElementById('btnResetDesignDefault');

    // Buka Modal Pilihan Gaya Desain
    if (btnOpen && modal) {
      btnOpen.addEventListener('click', () => {
        try {
          renderDesignTemplateCards();
          modal.classList.remove('hidden');
          if (window.lucide) lucide.createIcons();
        } catch (e) {
          console.error('Error opening design templates modal:', e);
        }
      });
    }

    // Helper untuk membuat mini visual wireframe preview
    function generateWireframeMockup(template) {
      const id = template.id;
      if (id === 'modern-warung') {
        return `
          <div class="mini-wireframe-box p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-inner">
            <div class="h-6 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 flex items-center justify-between px-2 text-[9px] text-white font-bold">
              <span>WARUNG NUSANTARA</span>
              <span class="bg-amber-400 text-slate-900 px-1 rounded text-[7px]">WA Cepat</span>
            </div>
            <div class="grid grid-cols-2 gap-1.5 pt-0.5">
              <div class="h-9 rounded bg-emerald-50 border border-emerald-200 p-1 flex flex-col justify-between">
                <span class="text-[8px] font-bold text-emerald-950 truncate">Nasi Padang</span>
                <span class="text-[7px] text-emerald-700 font-extrabold">Rp 30.000</span>
              </div>
              <div class="h-9 rounded bg-emerald-50 border border-emerald-200 p-1 flex flex-col justify-between">
                <span class="text-[8px] font-bold text-emerald-950 truncate">Sate Madura</span>
                <span class="text-[7px] text-emerald-700 font-extrabold">Rp 25.000</span>
              </div>
            </div>
            <div class="h-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[7px] font-bold">
              Chat Langsung via WhatsApp
            </div>
          </div>
        `;
      } else if (id === 'aesthetic-cafe') {
        return `
          <div class="mini-wireframe-box p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5 shadow-inner">
            <div class="grid grid-cols-12 gap-1 h-6">
              <div class="col-span-8 bg-amber-800 rounded px-1.5 flex items-center text-[8px] font-serif text-amber-100">
                Kedai Racikan
              </div>
              <div class="col-span-4 bg-amber-200 rounded flex items-center justify-center text-[8px] text-amber-900 font-bold">
                ☕ Coffee
              </div>
            </div>
            <div class="grid grid-cols-2 gap-1.5 pt-0.5">
              <div class="h-9 rounded border border-dashed border-amber-600/40 bg-white p-1 flex flex-col justify-between">
                <span class="text-[8px] font-serif font-bold text-amber-950 truncate">Es Kopi Susu</span>
                <span class="text-[7px] text-amber-800 font-bold">Rp 18.000</span>
              </div>
              <div class="h-9 rounded border border-dashed border-amber-600/40 bg-white p-1 flex flex-col justify-between">
                <span class="text-[8px] font-serif font-bold text-amber-950 truncate">Pastry Croissant</span>
                <span class="text-[7px] text-amber-800 font-bold">Rp 22.000</span>
              </div>
            </div>
            <div class="h-4 rounded bg-amber-800 text-amber-100 flex items-center justify-center text-[7px] font-medium font-serif">
              Reservasi Meja & Pemesanan
            </div>
          </div>
        `;
      } else if (id === 'bold-fastfood') {
        return `
          <div class="mini-wireframe-box p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1.5 shadow-inner">
            <div class="h-6 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-between px-2 text-[9px] text-white font-extrabold tracking-wide">
              <span>🔥 SPESIAL PEDAS GURIH</span>
              <span class="bg-yellow-400 text-red-950 px-1 rounded text-[7px] font-black">HEMAT!</span>
            </div>
            <div class="grid grid-cols-2 gap-1.5 pt-0.5">
              <div class="h-9 rounded bg-white border border-red-200 p-1 flex flex-col justify-between relative overflow-hidden">
                <div class="flex justify-between items-center">
                  <span class="text-[8px] font-black text-red-900 truncate">Ayam Geprek</span>
                  <span class="text-[6px] bg-red-600 text-white px-1 rounded">HOT</span>
                </div>
                <span class="text-[8px] text-red-700 font-black">Rp 18.000</span>
              </div>
              <div class="h-9 rounded bg-white border border-red-200 p-1 flex flex-col justify-between relative overflow-hidden">
                <div class="flex justify-between items-center">
                  <span class="text-[8px] font-black text-red-900 truncate">Bakso Mercon</span>
                  <span class="text-[6px] bg-orange-600 text-white px-1 rounded">FAV</span>
                </div>
                <span class="text-[8px] text-red-700 font-black">Rp 22.000</span>
              </div>
            </div>
            <div class="h-4 rounded bg-red-600 text-white flex items-center justify-center text-[7px] font-black animate-pulse-cta">
              PESAN SEKARANG (PROMO CEPAT)
            </div>
          </div>
        `;
      } else if (id === 'corporate-catering') {
        return `
          <div class="mini-wireframe-box p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1.5 shadow-inner">
            <div class="h-6 rounded-lg bg-slate-900 flex items-center justify-between px-2 text-[8px] text-white font-bold">
              <span>KATERING RESMI BERKUALITAS</span>
              <span class="bg-blue-600 text-white px-1 rounded text-[7px]">Halal ID</span>
            </div>
            <div class="grid grid-cols-2 gap-1.5 pt-0.5">
              <div class="h-9 rounded bg-white border border-blue-200 p-1 flex flex-col justify-between">
                <span class="text-[8px] font-bold text-slate-800 truncate">Paket Nasi Kotak</span>
                <span class="text-[7px] text-blue-700 font-bold">Min. 20 Box</span>
              </div>
              <div class="h-9 rounded bg-white border border-blue-200 p-1 flex flex-col justify-between">
                <span class="text-[8px] font-bold text-slate-800 truncate">Prasmanan Acara</span>
                <span class="text-[7px] text-blue-700 font-bold">Min. 50 Porsi</span>
              </div>
            </div>
            <div class="h-4 rounded bg-blue-700 text-white flex items-center justify-center text-[7px] font-bold">
              Permintaan Penawaran & Invoice
            </div>
          </div>
        `;
      } else if (id === 'luxury-artisan') {
        return `
          <div class="mini-wireframe-box p-2.5 rounded-xl border border-amber-500/40 bg-slate-950 space-y-1.5 shadow-inner">
            <div class="h-6 rounded-lg border border-amber-400/50 bg-slate-900 flex items-center justify-between px-2 text-[8px] text-amber-300 font-serif">
              <span>✦ HAMPERS & ARTISAN ✦</span>
              <span class="text-amber-400 text-[9px]">★ Premium</span>
            </div>
            <div class="grid grid-cols-2 gap-1.5 pt-0.5">
              <div class="h-9 rounded border border-amber-500/30 bg-slate-900 p-1 flex flex-col justify-between">
                <span class="text-[8px] font-serif text-amber-200 truncate">Hampers Spesial</span>
                <span class="text-[7px] text-amber-400 font-extrabold">Rp 250.000</span>
              </div>
              <div class="h-9 rounded border border-amber-500/30 bg-slate-900 p-1 flex flex-col justify-between">
                <span class="text-[8px] font-serif text-amber-200 truncate">Artisan Roast Beef</span>
                <span class="text-[7px] text-amber-400 font-extrabold">Rp 185.000</span>
              </div>
            </div>
            <div class="h-4 rounded border border-amber-400 bg-amber-500 text-slate-950 flex items-center justify-center text-[7px] font-bold">
              Pesan Eksklusif
            </div>
          </div>
        `;
      }
      return '';
    }

    // Render kartu-kartu gaya desain
    function renderDesignTemplateCards() {
      if (!container) return;
      container.innerHTML = '';

      const activeTemplateId = store.getDesignTemplate ? store.getDesignTemplate() : 'modern-warung';
      const templates = store.getAvailableDesignTemplates ? store.getAvailableDesignTemplates() : (window.DESIGN_TEMPLATES || {});

      Object.values(templates).forEach((template) => {
        const isActive = (template.id === activeTemplateId);
        const isRec = !!template.isRecommended;

        const card = document.createElement('div');
        card.className = `design-template-card flex flex-col justify-between p-4 sm:p-4.5 rounded-2xl bg-white transition border cursor-pointer ${
          isRec ? 'is-recommended' : 'border-slate-200 hover:border-slate-300'
        } ${isActive ? 'is-active ring-2 ring-slate-900 ring-offset-2' : ''}`;

        card.innerHTML = `
          <div>
            <!-- Status Bar Atas: Lencana Rekomendasi & Status Keaktifan -->
            <div class="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
              <div class="flex items-center gap-1.5">
                ${isRec ? `
                  <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    <i data-lucide="star" class="w-3 h-3 fill-amber-500 text-amber-500"></i>
                    <span>Rekomendasi #1</span>
                  </span>
                ` : `
                  <span class="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    Template Siap Pakai
                  </span>
                `}
              </div>

              <div>
                ${isActive ? `
                  <span class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-900 text-white shadow-xs whitespace-nowrap">
                    <i data-lucide="check" class="w-3.5 h-3.5 stroke-[2.5]"></i>
                    <span>Aktif</span>
                  </span>
                ` : `
                  <span class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 whitespace-nowrap">
                    Pilih Desain
                  </span>
                `}
              </div>
            </div>

            <!-- Nama Template & Sub-badge Kategori -->
            <div class="mb-2.5">
              <h4 class="font-bold text-base text-slate-900 leading-snug tracking-tight">
                ${escapeHtml(template.name)}
              </h4>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[11px] font-medium px-2 py-0.5 rounded-md ${
                  isRec ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-slate-100 text-slate-600'
                }">${escapeHtml(template.badge)}</span>
                <span class="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <i data-lucide="award" class="w-3.5 h-3.5 text-slate-500"></i> Skor ${template.score}
                </span>
              </div>
            </div>

            <!-- Mini Wireframe Visual Preview -->
            <div class="my-2.5">
              ${generateWireframeMockup(template)}
            </div>

            <!-- Tagline -->
            <p class="text-xs text-slate-600 mb-2 leading-relaxed">
              ${escapeHtml(template.tagline)}
            </p>

            <!-- Alasan Rekomendasi / Keunggulan -->
            <div class="mb-3 p-2.5 rounded-xl ${
              isRec ? 'bg-slate-50 border border-slate-200' : 'bg-slate-50/60 border border-slate-100'
            }">
              <div class="flex items-center gap-1 text-[11px] font-bold text-slate-800 mb-1">
                <i data-lucide="${isRec ? 'sparkles' : 'info'}" class="w-3.5 h-3.5 ${isRec ? 'text-amber-500' : 'text-slate-500'}"></i>
                <span>${isRec ? 'Mengapa Paling Direkomendasikan?' : 'Karakteristik Desain:'}</span>
              </div>
              <p class="text-[11px] leading-relaxed text-slate-600">
                ${escapeHtml(template.recommendationReason)}
              </p>
            </div>

            <!-- Highlights -->
            <ul class="space-y-1 mb-3 text-[11px] text-slate-600">
              ${(template.highlights || []).map(h => `
                <li class="flex items-start gap-1.5">
                  <i data-lucide="check" class="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5"></i>
                  <span>${escapeHtml(h)}</span>
                </li>
              `).join('')}
            </ul>

            <!-- Cocok Untuk -->
            <div class="text-[10px] text-slate-500 mb-3 border-t pt-2">
              <strong class="text-slate-700">Cocok untuk:</strong> ${escapeHtml(template.bestFor)}
            </div>
          </div>

          <!-- Tombol Aksi Terapkan -->
          <div>
            <button 
              type="button" 
              class="btnApplyTemplate w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                isActive 
                  ? 'bg-slate-900 text-white cursor-default shadow-xs' 
                  : (isRec 
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800')
              }"
            >
              <i data-lucide="${isActive ? 'check' : 'check-circle'}" class="w-3.5 h-3.5"></i>
              <span>${isActive ? 'Desain Sedang Digunakan' : 'Gunakan Desain Ini'}</span>
            </button>
          </div>
        `;

        // Handle Click pada kartu / tombol
        card.addEventListener('click', () => {
          try {
            const res = store.setDesignTemplate(template.id, true);
            if (res.success) {
              renderCanvas();
              renderDesignTemplateCards();
              showToast(`Gaya desain "${template.name}" berhasil diterapkan!`, 'success');
              if (window.lucide) lucide.createIcons();
            }
          } catch (e) {
            console.error('Error selecting design template card:', e);
          }
        });

        container.appendChild(card);
      });
    }

    // Tombol Cepat: Terapkan Template Rekomendasi
    if (btnApplyRecommended) {
      btnApplyRecommended.addEventListener('click', (e) => {
        try {
          e.stopPropagation();
          const res = store.setDesignTemplate('modern-warung', true);
          if (res.success) {
            renderCanvas();
            renderDesignTemplateCards();
            showToast('Desain Rekomendasi Utama (Warung Modern) berhasil diterapkan!', 'success', 3000);
          }
        } catch (e) {
          console.error('Error apply recommended template:', e);
        }
      });
    }

    // Tombol: Reset ke Desain Awal
    if (btnResetDefault) {
      btnResetDefault.addEventListener('click', () => {
        try {
          if (confirm('Kembalikan gaya desain website ke format awal (Warung Modern & Bersih)?')) {
            const res = store.setDesignTemplate('modern-warung', true);
            if (res.success) {
              renderCanvas();
              renderDesignTemplateCards();
              showToast('Gaya desain telah dikembalikan ke template awal.', 'info', 2500);
            }
          }
        } catch (e) {
          console.error('Error reset default design template:', e);
        }
      });
    }

    // Render cards pertama kali
    renderDesignTemplateCards();

  } catch (err) {
    console.error('Error saat initDesignTemplates:', err);
  }
}

// ======================================================================================
// 4. PALET ITEM & KOMPONEN SAMPING (DRAG & DROP SOURCE)
// ======================================================================================
function renderSidebar() {
  try {
    renderSidebarItems();
    renderSidebarSections();
  } catch (err) {
    console.error('Error renderSidebar:', err);
  }
}

function renderSidebarItems() {
  try {
    const listContainer = document.getElementById('sidebarDraggableItemsList');
    const store = getStore();
    if (!listContainer || !store) return;

    const items = store.getAvailableItems();
    listContainer.innerHTML = '';

    if (items.length === 0) {
      listContainer.innerHTML = `
        <div class="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed">
          Belum ada item di palet. Buat item baru di form atas.
        </div>
      `;
      return;
    }

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'draggable-item-card bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2.5 group';
      card.setAttribute('draggable', 'true');
      card.setAttribute('data-id', item.id);

      const categoryLower = (item.category || '').toLowerCase();
      let catBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
      if (categoryLower.includes('minum')) {
        catBadgeClass = 'bg-sky-50 text-sky-700 border-sky-200/80';
      } else if (categoryLower.includes('makan')) {
        catBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200/80';
      } else if (categoryLower.includes('snack') || categoryLower.includes('cemilan') || categoryLower.includes('kue')) {
        catBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200/80';
      }

      card.innerHTML = `
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <div class="drag-handle-grip cursor-grab" title="Pegang untuk menarik item ke kanvas">
            <i data-lucide="grip-vertical" class="w-3.5 h-3.5"></i>
          </div>
          <div class="min-w-0 flex-1">
            <h5 class="text-xs font-bold text-slate-800 truncate leading-snug">${escapeHtml(item.name)}</h5>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-[10px] font-semibold px-1.5 py-0.2 rounded border ${catBadgeClass}">${escapeHtml(item.category)}</span>
              <span class="text-[11px] font-extrabold text-emerald-700">Rp ${Number(item.price).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
        <button 
          type="button" 
          onclick="handleAddItemToCanvas('${item.id}')" 
          title="Taruh langsung ke kanvas tanpa drag"
          class="flex-shrink-0 px-2.5 py-1 bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-slate-900 rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-2xs hover:shadow-xs"
        >
          <i data-lucide="plus" class="w-3 h-3"></i>
          <span>Taruh</span>
        </button>
      `;

      card.addEventListener('dragstart', (e) => {
        try {
          card.classList.add('is-dragging');
          APP_STATE.draggedData = {
            type: 'PRODUCT',
            product: item
          };
          e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'PRODUCT', id: item.id }));
          e.dataTransfer.effectAllowed = 'copyMove';
        } catch (dragErr) {
          console.error('Error dragstart item:', dragErr);
        }
      });

      card.addEventListener('dragend', () => {
        try {
          card.classList.remove('is-dragging');
        } catch (e) {
          console.error('Error dragend item:', e);
        }
      });

      listContainer.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error('Error renderSidebarItems:', err);
  }
}

function renderSidebarActiveSections() {
  try {
    const listContainer = document.getElementById('sidebarActiveSectionsList');
    const badgeCount = document.getElementById('badgeActiveSectionsCount');
    const store = getStore();
    if (!listContainer || !store) return;

    const sortedSections = store.getSortedSections();
    if (badgeCount) {
      badgeCount.textContent = `${sortedSections.length} Bagian`;
    }

    listContainer.innerHTML = '';

    if (sortedSections.length === 0) {
      listContainer.innerHTML = `
        <div class="p-3 text-center text-slate-400 bg-white rounded-lg border border-slate-200/80 text-xs">
          Belum ada bagian di kanvas.
        </div>
      `;
      return;
    }

    // Hitung frekuensi tipe bagian untuk memberi label pembeda jika ada multiple
    const typeCounts = {};
    sortedSections.forEach(s => {
      typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
    });

    const typeIndices = {};

    sortedSections.forEach((section) => {
      typeIndices[section.type] = (typeIndices[section.type] || 0) + 1;
      const typeIdx = typeIndices[section.type];
      const countOfType = typeCounts[section.type] || 1;

      // Pembeda jika ada lebih dari 1 bagian bertipe sama (misal: 2 Hero atau 2 About)
      let roleLabel = '';
      let roleBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
      if (countOfType > 1) {
        roleLabel = `${section.type} #${typeIdx}`;
        roleBadgeClass = typeIdx === 1 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-700 border-slate-200';
      } else {
        roleLabel = section.type;
      }

      const card = document.createElement('div');
      card.className = 'active-section-card bg-white p-2 rounded-xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition flex items-center justify-between gap-2';
      
      card.innerHTML = `
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">#${section.orderIndex}</span>
            <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${roleBadgeClass}">
              ${roleLabel}
            </span>
          </div>
          <h6 class="text-xs font-semibold text-slate-800 truncate mt-1 leading-snug" title="${escapeHtml(section.title || '')}">
            ${escapeHtml(section.title || 'Tanpa Judul')}
          </h6>
        </div>
        <div class="flex items-center gap-1 flex-shrink-0">
          <button 
            type="button" 
            onclick="window.handleNavigateToSection('#section-${section.id}')" 
            title="Sorot / Scroll ke bagian ini di kanvas"
            class="px-2.5 py-1 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold transition shadow-2xs"
          >
            <span>Sorot</span>
          </button>
          <button 
            type="button" 
            onclick="openEditSectionModal('${section.id}')" 
            title="Edit komponen ini"
            class="p-1 hover:bg-emerald-50 text-emerald-700 rounded-lg border border-transparent hover:border-emerald-200 transition"
          >
            <i data-lucide="edit" class="w-3.5 h-3.5"></i>
          </button>
          <button 
            type="button" 
            onclick="handleDeleteSection('${section.id}')" 
            title="Hapus bagian ini"
            class="p-1 hover:bg-rose-50 text-rose-600 rounded-lg border border-transparent hover:border-rose-200 transition"
          >
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `;

      listContainer.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error('Error renderSidebarActiveSections:', err);
  }
}

function renderSidebarSections() {
  try {
    renderSidebarActiveSections();
    const listContainer = document.getElementById('sidebarDraggableSectionsList');
    if (!listContainer) return;

    const sectionPresets = [
      { type: 'NAVBAR', title: 'Header Navigasi (Navbar)', desc: 'Bar navigasi atas dengan logo dan menu dropdown tautan halaman' },
      { type: 'HERO', title: 'Banner Sambutan (Hero)', desc: 'Nama usaha mencolok, slogan pemikat, dan tombol WhatsApp' },
      { type: 'ABOUT', title: 'Tentang Kami (Cerita Usaha)', desc: 'Kisah awal mula usaha, resep warisan, dan dedikasi rasa' },
      { type: 'CATALOG', title: 'Katalog Menu & Produk', desc: 'Etalase hidangan lezat dan aneka produk yang dijual' },
      { type: 'CONTACT', title: 'Kontak WhatsApp & Lokasi', desc: 'Nomor telepon pemesanan, alamat toko, dan jam buka' },
      { type: 'FOOTER', title: 'Catatan Kaki (Footer)', desc: 'Hak cipta resmi dan pesan penutup hangat untuk pembeli' }
    ];

    listContainer.innerHTML = '';

    sectionPresets.forEach((preset) => {
      const card = document.createElement('div');
      card.className = 'draggable-item-card bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2.5 group';
      card.setAttribute('draggable', 'true');
      card.setAttribute('data-type', preset.type);

      card.innerHTML = `
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <div class="drag-handle-grip cursor-grab" title="Pegang untuk menarik bagian ke kanvas">
            <i data-lucide="grip-vertical" class="w-3.5 h-3.5"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200/80">${preset.type}</span>
            <h5 class="text-xs font-bold text-slate-800 mt-0.5 truncate leading-snug">${preset.title}</h5>
            <p class="text-[10px] text-slate-500 line-clamp-1">${preset.desc}</p>
          </div>
        </div>
        <button 
          type="button" 
          onclick="handleAddSectionPreset('${preset.type}')" 
          title="Taruh bagian ke kanvas tanpa drag"
          class="flex-shrink-0 px-2.5 py-1 bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-slate-900 rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-2xs hover:shadow-xs"
        >
          <i data-lucide="plus" class="w-3 h-3"></i>
          <span>Taruh</span>
        </button>
      `;

      card.addEventListener('dragstart', (e) => {
        try {
          card.classList.add('is-dragging');
          APP_STATE.draggedData = {
            type: 'SECTION',
            sectionType: preset.type
          };
          e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'SECTION', sectionType: preset.type }));
          e.dataTransfer.effectAllowed = 'copyMove';
        } catch (e2) {
          console.error('Error dragstart section:', e2);
        }
      });

      card.addEventListener('dragend', () => {
        try {
          card.classList.remove('is-dragging');
        } catch (e3) {
          console.error('Error dragend section:', e3);
        }
      });

      listContainer.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error('Error renderSidebarSections:', err);
  }
}

function handleAddItemToCanvas(itemId) {
  try {
    const store = getStore();
    if (!store) return;

    const item = store.getAvailableItems().find(i => i.id === itemId);
    if (!item) return;

    const res = store.addProduct({
      name: item.name,
      price: item.price,
      category: item.category
    });

    if (res.success) {
      renderCanvas();
      renderSidebarItems();
      if (window.lucide) lucide.createIcons();
      showToast(`Item "${item.name}" berhasil masuk ke kanvas!`, 'success');
    }
  } catch (err) {
    console.error('Error handleAddItemToCanvas:', err);
  }
}

function handleAddSectionPreset(type) {
  try {
    const store = getStore();
    if (!store) return;

    const meta = SECTION_TYPE_METADATA[type] || SECTION_TYPE_METADATA.ABOUT;
    let defaultContent = meta.content.placeholder.replace('Contoh: ', '');
    if (type === 'NAVBAR') {
      defaultContent = JSON.stringify([
        { label: 'Beranda', target: '#hero' },
        { label: 'Tentang Kami', target: '#about' },
        { label: 'Daftar Menu', target: '#catalog' },
        { label: 'Kontak', target: '#contact' }
      ]);
    }
    const res = store.addSection({
      type,
      title: meta.title.placeholder.replace('Contoh: ', ''),
      subtitle: meta.subtitle.placeholder.replace('Contoh: ', ''),
      content: defaultContent
    });

    if (res.success) {
      renderCanvas();
      renderSidebarSections();
      showToast(`Bagian ${type} berhasil ditambahkan ke kanvas!`, 'success');
    }
  } catch (err) {
    console.error('Error handleAddSectionPreset:', err);
  }
}

// ======================================================================================
// 5. CANVAS REAL-TIME PREVIEW RENDERER
// ======================================================================================
function renderCanvas() {
  try {
    const wrapper = document.getElementById('canvasSectionsWrapper');
    const store = getStore();
    if (!wrapper || !store) {
      console.warn('Canvas wrapper atau store belum siap untuk renderCanvas');
      return;
    }

    const theme = (store.getTheme && store.getTheme()) || store.getDefaultTheme();
    const activeDesign = (store.getActiveDesignTemplateData && store.getActiveDesignTemplateData()) || {
      id: 'modern-warung',
      styleConfig: {
        heroVariant: 'modern-centered',
        cardVariant: 'modern-rounded',
        accentLabel: 'Usaha Kuliner Terpercaya'
      }
    };
    const styleCfg = activeDesign.styleConfig || {};
    const sortedSections = store.getSortedSections();
    const products = store.getProducts();

    // Terapkan tema ke kontainer utama kanvas (Live Real-Time Update)
    const canvasPaper = document.getElementById('canvasPaper');
    if (canvasPaper) {
      canvasPaper.style.backgroundColor = theme.backgroundColor || '#ffffff';
      canvasPaper.style.fontFamily = `'${theme.bodyFont || 'Plus Jakarta Sans'}', sans-serif`;
      canvasPaper.style.color = theme.textColor || '#334155';
    }

    const statSec = document.getElementById('statSectionCount');
    const statProd = document.getElementById('statProductCount');
    if (statSec) statSec.textContent = `Total Bagian: ${sortedSections.length}`;
    if (statProd) statProd.textContent = `Total Menu: ${products.length}`;

    wrapper.innerHTML = '';

    if (sortedSections.length === 0) {
      wrapper.innerHTML = `
        <div class="p-12 text-center text-slate-400">
          <i data-lucide="layers" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
          <p class="font-bold text-slate-600 text-lg">Belum ada bagian website di kanvas.</p>
          <p class="text-sm">Tarik bagian dari palet samping atau gunakan tombol Tambah Bagian.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Hitung frekuensi tipe bagian untuk memberi label pembeda jika ada multiple bagian bertipe sama (misal: 2 Hero)
    const typeCounts = {};
    sortedSections.forEach(s => {
      typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
    });
    const typeIndices = {};

    sortedSections.forEach((section, index) => {
      try {
        typeIndices[section.type] = (typeIndices[section.type] || 0) + 1;
        const currentTypeIdx = typeIndices[section.type];
        const countOfType = typeCounts[section.type] || 1;

        let roleTag = '';
        let roleBadgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
        if (countOfType > 1) {
          roleTag = ` #${currentTypeIdx}`;
          roleBadgeColor = currentTypeIdx === 1 ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-slate-100 text-slate-800 border-slate-200';
        }

        if (APP_STATE.isEditorMode) {
          const dropZoneGap = document.createElement('div');
          dropZoneGap.className = 'drop-zone-section-gap';
          dropZoneGap.setAttribute('data-target-index', section.orderIndex);
          dropZoneGap.innerHTML = `<span>+ Lepaskan bagian di sini</span>`;
          
          dropZoneGap.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            dropZoneGap.classList.add('drop-hover');
          });
          dropZoneGap.addEventListener('dragleave', () => {
            dropZoneGap.classList.remove('drop-hover');
          });
          dropZoneGap.addEventListener('drop', (e) => {
            try {
              e.preventDefault();
              dropZoneGap.classList.remove('drop-hover');
              handleSectionDropAt(section.orderIndex);
            } catch (dropErr) {
              console.error('Error drop section gap:', dropErr);
            }
          });
          wrapper.appendChild(dropZoneGap);
        }

        const secElement = document.createElement('section');
        secElement.id = `section-${section.id}`;
        secElement.className = `section-wrapper ${section.type === 'FOOTER' ? 'text-white' : ''}`;
        secElement.setAttribute('data-id', section.id);
        secElement.setAttribute('data-type', section.type);
        secElement.setAttribute('data-order', section.orderIndex);

        let controlsOverlay = '';
        if (APP_STATE.isEditorMode) {
          controlsOverlay = `
            <div class="section-controls-overlay flex items-center gap-1.5 bg-white/95 backdrop-blur p-1.5 rounded-xl shadow-lg border border-slate-300 max-w-[95%]">
              <span class="badge-tag bg-slate-900 text-white font-mono text-[10px] px-2 py-0.5 rounded">#${section.orderIndex}</span>
              <span class="badge-tag border font-bold text-[10px] px-2 py-0.5 rounded ${roleBadgeColor}">
                ${section.type}${roleTag}
              </span>
              <span class="text-xs font-semibold text-slate-700 truncate max-w-[120px] sm:max-w-[200px]" title="${escapeHtml(section.title || '')}">
                "${escapeHtml(section.title || 'Tanpa Judul')}"
              </span>
              <div class="h-3.5 w-px bg-slate-200 mx-0.5"></div>
              
              <button 
                type="button" 
                onclick="handleMoveSection('${section.id}', 'UP')" 
                title="Pindah ke Atas" 
                class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}"
                ${index === 0 ? 'disabled' : ''}
              >
                <i data-lucide="chevron-up" class="w-4 h-4"></i>
              </button>

              <button 
                type="button" 
                onclick="handleMoveSection('${section.id}', 'DOWN')" 
                title="Pindah ke Bawah" 
                class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 ${index === sortedSections.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}"
                ${index === sortedSections.length - 1 ? 'disabled' : ''}
              >
                <i data-lucide="chevron-down" class="w-4 h-4"></i>
              </button>

              <button 
                type="button" 
                onclick="openEditSectionModal('${section.id}')" 
                title="Edit Komponen Ini" 
                class="p-1.5 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 rounded-lg"
              >
                <i data-lucide="edit" class="w-4 h-4"></i>
              </button>

              <button 
                type="button" 
                onclick="handleDeleteSection('${section.id}')" 
                title="Hapus Bagian Ini" 
                class="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg"
              >
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          `;
        }

        let innerHTML = '';

        switch (section.type) {
          case 'NAVBAR': {
            let navLinks = [];
            try {
              if (section.content && section.content.trim().startsWith('[')) {
                navLinks = JSON.parse(section.content);
              }
            } catch (e) {
              navLinks = [];
            }

            if (!Array.isArray(navLinks) || navLinks.length === 0) {
              navLinks = [
                { label: 'Beranda', target: '#hero' },
                { label: 'Tentang Kami', target: '#about' },
                { label: 'Daftar Menu', target: '#catalog' },
                { label: 'Kontak', target: '#contact' }
              ];
            }

            const ctaText = section.subtitle || 'Hubungi Kami';
            const brandName = section.title || 'Nama Usaha Anda';

            innerHTML = `
              <header class="w-full bg-white/95 backdrop-blur border-b border-slate-200/90 shadow-2xs py-3.5 px-4 sm:px-6 transition">
                <div class="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
                  
                  <!-- Logo Brand -->
                  <a href="#hero" onclick="window.handleNavigateToSection('#hero'); return false;" class="flex items-center gap-2 group cursor-pointer text-decoration-none">
                    <div class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-xs transition group-hover:scale-105" style="background-color: ${theme.primaryColor || '#0f172a'};">
                      <i data-lucide="utensils-crossed" class="w-4 h-4"></i>
                    </div>
                    <span class="font-bold text-base sm:text-lg tracking-tight group-hover:opacity-80 transition" style="font-family: '${theme.headingFont}', Georgia, serif; color: ${theme.headingColor || '#0f172a'};">
                      ${escapeHtml(brandName)}
                    </span>
                  </a>

                  <!-- Menu Links Navigasi -->
                  <nav class="flex items-center flex-wrap gap-1 sm:gap-2">
                    ${navLinks.map((item) => `
                      <a 
                        href="${escapeHtml(item.target || '#')}" 
                        onclick="window.handleNavigateToSection('${escapeHtml(item.target || '#')}'); return false;"
                        class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition flex items-center gap-1 group/link cursor-pointer"
                        title="Klik untuk membuka bagian ${escapeHtml(item.target || '')}"
                      >
                        <span>${escapeHtml(item.label || 'Menu')}</span>
                        ${APP_STATE.isEditorMode ? `<span class="text-[9px] font-mono text-slate-400 group-hover/link:text-indigo-600 transition">(${escapeHtml(item.target || '')})</span>` : ''}
                      </a>
                    `).join('')}
                  </nav>

                  <!-- CTA Button -->
                  ${ctaText ? `
                    <a 
                      href="#contact" 
                      onclick="window.handleNavigateToSection('#contact'); return false;"
                      class="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                      style="background-color: ${theme.primaryColor || '#0f172a'};"
                    >
                      <i data-lucide="phone-call" class="w-3.5 h-3.5"></i>
                      <span>${escapeHtml(ctaText)}</span>
                    </a>
                  ` : ''}

                </div>
              </header>
            `;
            break;
          }
          case 'HERO': {
            const heroVariant = styleCfg.heroVariant || 'modern-centered';
            const heroDarkTone = theme.headingColor === '#0f172a' ? '#064e3b' : theme.headingColor;

            if (heroVariant === 'split-cafe') {
              innerHTML = `
                <div class="relative overflow-hidden py-14 px-6 sm:px-12" style="background: linear-gradient(135deg, ${theme.primaryColor} 0%, #2b1104 100%); color: #fffbeb;">
                  <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div class="md:col-span-7 space-y-3.5 text-left">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur">
                        <i data-lucide="coffee" class="w-3.5 h-3.5"></i> ${escapeHtml(styleCfg.accentLabel || 'Kedai Racikan Istimewa')}
                      </span>
                      <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight" style="font-family: '${theme.headingFont}', Georgia, serif; color: ${theme.secondaryColor || '#fbbf24'};">
                        ${escapeHtml(section.title || 'Nama Usaha Anda')}
                      </h1>
                      <p class="text-base sm:text-lg font-medium opacity-95" style="font-family: '${theme.bodyFont}', sans-serif;">
                        ${escapeHtml(section.subtitle || 'Slogan atau keunggulan utama kedai Anda')}
                      </p>
                      <p class="text-xs sm:text-sm max-w-xl leading-relaxed opacity-90" style="font-family: '${theme.bodyFont}', sans-serif;">
                        ${escapeHtml(section.content || 'Racikan istimewa seduhan kopi dan kudapan lezat dengan nuansa hangat.')}
                      </p>
                      <div class="pt-2 flex flex-wrap gap-2.5">
                        <a href="#section-catalog" class="px-5 py-2.5 font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-sm text-amber-950" style="background-color: ${theme.secondaryColor || '#f59e0b'};">
                          <i data-lucide="coffee" class="w-4 h-4"></i>
                          <span>Daftar Racikan & Menu</span>
                        </a>
                        <a href="#section-contact" class="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/25 transition flex items-center gap-2 backdrop-blur text-sm">
                          <i data-lucide="calendar" class="w-4 h-4"></i>
                          <span>Reservasi / Pesan Meja</span>
                        </a>
                      </div>
                    </div>
                    <div class="md:col-span-5 hidden md:block">
                      <div class="p-5 rounded-2xl border border-amber-500/30 bg-black/30 backdrop-blur text-center space-y-2.5">
                        <div class="w-14 h-14 mx-auto rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/40">
                          <i data-lucide="cup-soda" class="w-7 h-7"></i>
                        </div>
                        <h4 class="font-serif font-bold text-amber-200 text-sm">Nuansa Hangat & Santai</h4>
                        <p class="text-xs text-amber-100/80 leading-relaxed">Nikmati sajian segar dengan tempat yang nyaman untuk santap santai maupun bekerja.</p>
                        <span class="inline-block text-[10px] font-bold text-amber-300 bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-600/40">Wi-Fi Cepat & Colokan Tersedia</span>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            } else if (heroVariant === 'bold-banner') {
              innerHTML = `
                <div class="relative overflow-hidden py-16 px-6 sm:px-12 text-center text-white" style="background: linear-gradient(135deg, ${theme.primaryColor} 0%, #7f1d1d 100%);">
                  <div class="max-w-3xl mx-auto space-y-4">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-yellow-400 text-red-950 shadow-md">
                      <i data-lucide="flame" class="w-3.5 h-3.5 fill-red-600 text-red-600"></i> ${escapeHtml(styleCfg.accentLabel || 'Pedas Mantap Gurih Juara')}
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase drop-shadow-md" style="font-family: '${theme.headingFont}', Impact, sans-serif; color: #ffffff;">
                      ${escapeHtml(section.title || 'Nama Usaha Anda')}
                    </h1>
                    <p class="text-base sm:text-lg font-bold text-amber-300" style="font-family: '${theme.bodyFont}', sans-serif;">
                      ${escapeHtml(section.subtitle || 'Slogan atau keunggulan utama toko Anda')}
                    </p>
                    <p class="text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed text-rose-100 font-medium" style="font-family: '${theme.bodyFont}', sans-serif;">
                      ${escapeHtml(section.content || 'Penjelasan singkat tentang produk atau usaha yang Anda tawarkan kepada pelanggan.')}
                    </p>
                    <div class="pt-3 flex flex-wrap justify-center gap-3">
                      <a href="#section-contact" class="px-6 py-3 font-black rounded-xl shadow-xl transition flex items-center gap-2 text-sm text-red-950 bg-yellow-400 hover:bg-yellow-300 animate-pulse-cta">
                        <i data-lucide="zap" class="w-4 h-4 fill-red-950 text-red-950"></i>
                        <span>PESAN CEPAT VIA WHATSAPP (PROMO)</span>
                      </a>
                      <a href="#section-catalog" class="px-5 py-3 bg-black/40 hover:bg-black/60 text-white font-bold rounded-xl border border-white/30 transition flex items-center gap-2 text-sm">
                        <i data-lucide="utensils" class="w-4 h-4"></i>
                        <span>Lihat Menu Lengkap</span>
                      </a>
                    </div>
                  </div>
                </div>
              `;
            } else if (heroVariant === 'corporate-card') {
              innerHTML = `
                <div class="relative overflow-hidden py-14 px-6 sm:px-12 text-white" style="background: linear-gradient(135deg, ${theme.primaryColor} 0%, #0f172a 100%);">
                  <div class="max-w-4xl mx-auto space-y-3.5">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-blue-400"></i> ${escapeHtml(styleCfg.accentLabel || 'Jasa Katering Resmi Berpengalaman')}
                      </span>
                      <span class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-700/90 text-white">100% Halal Indonesia</span>
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight" style="font-family: '${theme.headingFont}', Inter, sans-serif; color: #ffffff;">
                      ${escapeHtml(section.title || 'Nama Usaha Anda')}
                    </h1>
                    <p class="text-base sm:text-lg font-medium text-slate-200" style="font-family: '${theme.bodyFont}', sans-serif;">
                      ${escapeHtml(section.subtitle || 'Slogan atau keunggulan utama katering Anda')}
                    </p>
                    <p class="text-xs sm:text-sm max-w-2xl leading-relaxed text-slate-300" style="font-family: '${theme.bodyFont}', sans-serif;">
                      ${escapeHtml(section.content || 'Melayani pesanan paket nasi kotak kantor, prasmanan acara akbar, dan katering harian.')}
                    </p>
                    <div class="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-xl text-[11px] font-semibold text-slate-200">
                      <div class="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10">
                        <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-400"></i> Higienis & Uji Rasa
                      </div>
                      <div class="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10">
                        <i data-lucide="clock" class="w-3.5 h-3.5 text-blue-300"></i> Kirim Tepat Waktu
                      </div>
                      <div class="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10">
                        <i data-lucide="file-text" class="w-3.5 h-3.5 text-amber-300"></i> Faktur & Invoice Resmi
                      </div>
                    </div>
                    <div class="pt-2 flex flex-wrap gap-2.5">
                      <a href="#section-catalog" class="px-5 py-2.5 font-bold rounded-lg shadow-lg transition flex items-center gap-2 text-sm text-white" style="background-color: ${theme.secondaryColor || '#0284c7'};">
                        <i data-lucide="package" class="w-4 h-4"></i>
                        <span>Pilihan Paket Nasi Kotak & Prasmanan</span>
                      </a>
                      <a href="#section-contact" class="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-lg border border-white/25 transition flex items-center gap-2 backdrop-blur text-sm">
                        <i data-lucide="mail" class="w-4 h-4"></i>
                        <span>Minta Penawaran / Proposal</span>
                      </a>
                    </div>
                  </div>
                </div>
              `;
            } else if (heroVariant === 'luxury-artisan') {
              innerHTML = `
                <div class="relative overflow-hidden py-16 px-6 sm:px-12 text-center text-white" style="background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%); border-bottom: 1px solid #d9770650;">
                  <div class="max-w-3xl mx-auto space-y-4 border border-amber-500/30 p-7 sm:p-9 rounded-3xl bg-slate-900/60 backdrop-blur shadow-2xl">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-serif font-bold uppercase tracking-widest bg-amber-500/15 text-amber-300 border border-amber-500/40">
                      <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i> ${escapeHtml(styleCfg.accentLabel || 'Koleksi Kuliner Mewah & Eksklusif')}
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-serif font-extrabold tracking-wide leading-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                      ${escapeHtml(section.title || 'Nama Usaha Anda')}
                    </h1>
                    <p class="text-base sm:text-lg font-serif italic text-amber-100/90">
                      ${escapeHtml(section.subtitle || 'Slogan atau keunggulan utama toko Anda')}
                    </p>
                    <p class="text-xs sm:text-sm max-w-xl mx-auto leading-relaxed text-slate-300 font-light" style="font-family: '${theme.bodyFont}', sans-serif;">
                      ${escapeHtml(section.content || 'Dihadirkan dengan bahan baku grade premium dan sentuhan keahlian koki berpengalaman.')}
                    </p>
                    <div class="pt-3 flex flex-wrap justify-center gap-3">
                      <a href="#section-catalog" class="px-6 py-2.5 font-bold rounded-xl shadow-xl transition flex items-center gap-2 text-sm text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:opacity-95">
                        <i data-lucide="gift" class="w-4 h-4"></i>
                        <span>Lihat Koleksi Hampers & Menu</span>
                      </a>
                      <a href="#section-contact" class="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-amber-200 font-semibold rounded-xl border border-amber-400/30 transition flex items-center gap-2 backdrop-blur text-sm">
                        <i data-lucide="crown" class="w-4 h-4 text-amber-400"></i>
                        <span>Pesan Khusus VIP</span>
                      </a>
                    </div>
                  </div>
                </div>
              `;
            } else {
              // Default: modern-centered (WARUNG MODERN & BERSIH - Paling Direkomendasikan)
              innerHTML = `
                <div class="relative overflow-hidden text-white py-16 px-6 sm:px-12 text-center" style="background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${heroDarkTone} 100%);">
                  <div class="max-w-3xl mx-auto space-y-4">
                    <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-white border border-white/25 backdrop-blur shadow-sm">
                      <i data-lucide="award" class="w-3.5 h-3.5 text-amber-300"></i> ${escapeHtml(styleCfg.accentLabel || 'Usaha Kuliner Terpercaya')}
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight" style="font-family: '${theme.headingFont}', Georgia, serif; color: ${theme.secondaryColor || '#fbbf24'};">
                      ${escapeHtml(section.title || 'Nama Usaha Anda')}
                    </h1>
                    <p class="text-base sm:text-lg font-medium opacity-95" style="font-family: '${theme.bodyFont}', sans-serif;">
                      ${escapeHtml(section.subtitle || 'Slogan atau keunggulan utama toko Anda')}
                    </p>
                    <p class="text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed opacity-90" style="font-family: '${theme.bodyFont}', sans-serif;">
                      ${escapeHtml(section.content || 'Penjelasan singkat tentang produk atau usaha yang Anda tawarkan kepada pelanggan.')}
                    </p>
                    <div class="pt-3 flex flex-wrap justify-center gap-3">
                      <a href="#section-catalog" class="px-5 py-2.5 font-bold rounded-xl shadow-lg transition flex items-center gap-2 text-sm text-slate-950" style="background-color: ${theme.secondaryColor || '#f59e0b'};">
                        <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                        <span>Lihat Menu & Harga</span>
                      </a>
                      <a href="#section-contact" class="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/25 transition flex items-center gap-2 backdrop-blur text-sm">
                        <i data-lucide="phone-call" class="w-4 h-4"></i>
                        <span>Pesan Lewat WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }
            break;
          }

          case 'ABOUT':
            innerHTML = `
              <div class="py-14 px-6 sm:px-12" style="background-color: ${theme.backgroundColor}; color: ${theme.textColor}; font-family: '${theme.bodyFont}', sans-serif;">
                <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div class="md:col-span-5 rounded-2xl p-6 border text-center space-y-2 shadow-sm" style="background-color: ${theme.cardBackground || '#f8fafc'}; border-color: ${theme.primaryColor}30;">
                    <div class="w-14 h-14 mx-auto text-white rounded-2xl flex items-center justify-center shadow-lg" style="background-color: ${theme.primaryColor};">
                      <i data-lucide="heart-handshake" class="w-7 h-7"></i>
                    </div>
                    <h4 class="font-bold text-base" style="font-family: '${theme.headingFont}', Georgia, serif; color: ${theme.headingColor};">Resep Khas & Higienis</h4>
                    <p class="text-xs leading-relaxed" style="color: ${theme.textColor};">
                      Diolah setiap hari dengan bahan pilihan segar dan rempah alami tanpa bahan pengawet.
                    </p>
                  </div>
                  <div class="md:col-span-7 space-y-3">
                    <span class="text-xs font-bold uppercase tracking-wider" style="color: ${theme.primaryColor};">Cerita Kami</span>
                    <h2 class="text-2xl sm:text-3xl font-bold" style="font-family: '${theme.headingFont}', Georgia, serif; color: ${theme.headingColor};">
                      ${escapeHtml(section.title || 'Tentang Kami')}
                    </h2>
                    <h3 class="text-sm font-semibold opacity-90" style="color: ${theme.textColor};">
                      ${escapeHtml(section.subtitle || '')}
                    </h3>
                    <p class="text-xs sm:text-sm leading-relaxed whitespace-pre-line" style="color: ${theme.textColor};">
                      ${escapeHtml(section.content || 'Isi deskripsi mengenai sejarah atau nilai usaha Anda di sini.')}
                    </p>
                  </div>
                </div>
              </div>
            `;
            break;

          case 'CATALOG': {
            const cardVariant = styleCfg.cardVariant || 'modern-rounded';

            const productCards = products.map((p) => {
              if (cardVariant === 'cafe-handcrafted') {
                return `
                  <div class="group relative rounded-2xl p-4 border-2 border-dashed shadow-sm hover:shadow-md transition flex flex-col justify-between" style="background-color: ${theme.cardBackground || '#fffbeb'}; border-color: ${theme.primaryColor}50;">
                    <div>
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-dashed" style="color: ${theme.primaryColor}; background-color: ${theme.primaryColor}15; border-color: ${theme.primaryColor}60;">
                          ☕ ${escapeHtml(p.category || 'Menu Racikan')}
                        </span>
                        ${APP_STATE.isEditorMode ? `
                          <button type="button" onclick="handleDeleteProduct('${p.id}')" title="Hapus item ini dari kanvas" class="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                          </button>
                        ` : '<span class="text-xs opacity-60">Seduh Segar</span>'}
                      </div>
                      <h4 class="font-bold text-sm mb-1" style="font-family: '${theme.headingFont}', Georgia, serif; color: ${theme.headingColor};">${escapeHtml(p.name)}</h4>
                    </div>
                    <div class="mt-3 pt-2.5 border-t border-amber-900/10 flex items-center justify-between">
                      <div class="font-extrabold text-base" style="color: ${theme.primaryColor};">
                        Rp ${Number(p.price || 0).toLocaleString('id-ID')}
                      </div>
                      <span class="text-[11px] opacity-80 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium">Khas Kedai</span>
                    </div>
                  </div>
                `;
              } else if (cardVariant === 'bold-compact') {
                return `
                  <div class="group relative rounded-xl p-4 border-2 shadow-md hover:shadow-lg transition flex flex-col justify-between" style="background-color: ${theme.cardBackground || '#ffffff'}; border-color: #ef444450;">
                    <div>
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white flex items-center gap-1">
                          <i data-lucide="flame" class="w-3 h-3 fill-white text-white"></i> TERLARIS
                        </span>
                        ${APP_STATE.isEditorMode ? `
                          <button type="button" onclick="handleDeleteProduct('${p.id}')" title="Hapus item ini dari kanvas" class="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                          </button>
                        ` : '<span class="text-[10px] font-black text-red-600">HOT!</span>'}
                      </div>
                      <h4 class="font-black text-sm mb-1" style="font-family: '${theme.headingFont}', sans-serif; color: ${theme.headingColor};">${escapeHtml(p.name)}</h4>
                    </div>
                    <div class="mt-3 pt-2 border-t border-red-100 flex items-center justify-between">
                      <div class="font-black text-base text-red-700">
                        Rp ${Number(p.price || 0).toLocaleString('id-ID')}
                      </div>
                      <span class="text-[10px] font-black text-white px-2 py-0.5 rounded bg-amber-500 shadow-sm">Siap Saji</span>
                    </div>
                  </div>
                `;
              } else if (cardVariant === 'corporate-clean') {
                return `
                  <div class="group relative rounded-xl p-4 border shadow-sm hover:shadow-md transition flex flex-col justify-between" style="background-color: ${theme.cardBackground || '#ffffff'}; border-color: #93c5fd;">
                    <div>
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                          ${escapeHtml(p.category || 'Paket Katering')}
                        </span>
                        ${APP_STATE.isEditorMode ? `
                          <button type="button" onclick="handleDeleteProduct('${p.id}')" title="Hapus item ini dari kanvas" class="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                          </button>
                        ` : '<span class="text-xs text-blue-700 font-semibold">Tersedia</span>'}
                      </div>
                      <h4 class="font-bold text-sm mb-1" style="font-family: '${theme.headingFont}', Inter, sans-serif; color: ${theme.headingColor};">${escapeHtml(p.name)}</h4>
                    </div>
                    <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <div class="font-extrabold text-base text-blue-800">
                        Rp ${Number(p.price || 0).toLocaleString('id-ID')} <span class="text-[10px] font-normal text-slate-500">/ porsi</span>
                      </div>
                      <span class="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Min. 10 Box</span>
                    </div>
                  </div>
                `;
              } else if (cardVariant === 'luxury-gold') {
                return `
                  <div class="group relative rounded-2xl p-4 border shadow-xl hover:shadow-2xl transition flex flex-col justify-between" style="background-color: #1e293b; border-color: #f59e0b60;">
                    <div>
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="text-[10px] font-serif font-bold uppercase px-2 py-0.5 rounded-full border border-amber-400/50 bg-amber-500/10 text-amber-300">
                          ✦ ${escapeHtml(p.category || 'Artisan Selection')}
                        </span>
                        ${APP_STATE.isEditorMode ? `
                          <button type="button" onclick="handleDeleteProduct('${p.id}')" title="Hapus item ini dari kanvas" class="text-slate-400 hover:text-amber-400 p-1 hover:bg-slate-800 rounded-lg transition">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                          </button>
                        ` : '<span class="text-xs text-amber-400 font-serif">Premium</span>'}
                      </div>
                      <h4 class="font-bold text-sm mb-1 font-serif text-amber-100">${escapeHtml(p.name)}</h4>
                    </div>
                    <div class="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between">
                      <div class="font-bold text-base text-amber-400 font-serif">
                        Rp ${Number(p.price || 0).toLocaleString('id-ID')}
                      </div>
                      <span class="text-[10px] font-medium text-amber-200 bg-amber-950/70 border border-amber-600/30 px-2 py-0.5 rounded-full">Edisi Eksklusif</span>
                    </div>
                  </div>
                `;
              } else {
                // Default: modern-rounded (Warung Modern)
                return `
                  <div class="group relative rounded-2xl p-4 border shadow-sm hover:shadow-md transition flex flex-col justify-between" style="background-color: ${theme.cardBackground || '#ffffff'}; border-color: ${theme.primaryColor}25;">
                    <div>
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border" style="color: ${theme.primaryColor}; background-color: ${theme.primaryColor}15; border-color: ${theme.primaryColor}30;">
                          ${escapeHtml(p.category || 'Menu')}
                        </span>
                        ${APP_STATE.isEditorMode ? `
                          <button 
                            type="button" 
                            onclick="handleDeleteProduct('${p.id}')" 
                            title="Hapus item ini dari kanvas" 
                            class="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition"
                          >
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                          </button>
                        ` : '<span class="text-xs opacity-60">Tersedia</span>'}
                      </div>
                      <h4 class="font-bold text-sm mb-1" style="font-family: '${theme.headingFont}', Georgia, serif; color: ${theme.headingColor};">${escapeHtml(p.name)}</h4>
                    </div>
                    <div class="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                      <div class="font-extrabold text-base" style="color: ${theme.primaryColor};">
                        Rp ${Number(p.price || 0).toLocaleString('id-ID')}
                      </div>
                      <span class="text-[11px] opacity-75 px-1.5 py-0.5 rounded" style="background-color: ${theme.primaryColor}10;">Tersedia</span>
                    </div>
                  </div>
                `;
              }
            }).join('');

            innerHTML = `
              <div id="section-catalog" class="py-14 px-6 sm:px-12" style="background-color: ${theme.backgroundColor === '#ffffff' ? '#f8fafc' : theme.backgroundColor}; color: ${theme.textColor}; font-family: '${theme.bodyFont}', sans-serif;">
                <div class="max-w-4xl mx-auto space-y-5">
                  
                  <div class="text-center space-y-1.5">
                    <span class="text-xs font-bold uppercase tracking-wider" style="color: ${theme.secondaryColor || '#d97706'};">
                      ${escapeHtml(styleCfg.accentLabel || 'Katalog Produk & Menu')}
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-bold" style="font-family: '${theme.headingFont}', Georgia, serif; color: ${theme.headingColor};">
                      ${escapeHtml(section.title || 'Daftar Menu & Produk')}
                    </h2>
                    <p class="text-xs sm:text-sm max-w-xl mx-auto" style="color: ${theme.textColor};">
                      ${escapeHtml(section.subtitle || 'Pilihan sajian istimewa untuk santap Anda')}
                    </p>
                    ${section.content ? `<p class="text-xs italic opacity-80" style="color: ${theme.textColor};">${escapeHtml(section.content)}</p>` : ''}
                  </div>

                  ${APP_STATE.isEditorMode ? `
                    <div 
                      id="catalogDropTarget"
                      class="product-drop-target p-4 sm:p-5 text-center cursor-pointer"
                      onclick="openQuickAddProductModal()"
                    >
                      <div class="flex items-center justify-center gap-2 font-bold text-sm mb-1" style="color: ${theme.primaryColor};">
                        <i data-lucide="sparkles" class="w-5 h-5"></i>
                        <span>TARIK (DRAG) ITEM DARI PALET SAMPING & LEPASKAN (DROP) DI SINI</span>
                      </div>
                      <p class="text-xs opacity-75" style="color: ${theme.textColor};">
                        Atau klik area ini untuk mengetik menu baru secara manual ke dalam list
                      </p>
                    </div>
                  ` : ''}

                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
                    ${products.length > 0 ? productCards : `
                      <div class="col-span-2 text-center py-8 rounded-2xl border-2 border-dashed border-slate-300 p-6" style="background-color: ${theme.cardBackground || '#ffffff'};">
                        <i data-lucide="package-open" class="w-10 h-10 mx-auto text-slate-400 mb-2"></i>
                        <p class="font-bold text-sm" style="color: ${theme.headingColor};">Belum ada item di dalam list produk.</p>
                        <p class="text-xs opacity-75 mt-1 mb-3" style="color: ${theme.textColor};">Tarik item dari palet samping sebelah kiri untuk mengisi kanvas.</p>
                      </div>
                    `}
                  </div>
                </div>
              </div>
            `;
            break;
          }

          case 'CONTACT': {
            let waHref = 'https://wa.me/?text=Halo%20saya%20ingin%20memesan%20makanan';
            const waMatch = (section.content || '').match(/(?:WhatsApp|WA|Telepon|Telp|No\.?):\s*([0-9+\-\s]+)/i);
            if (waMatch) {
              let cleanDigits = waMatch[1].replace(/\D/g, '');
              if (cleanDigits.startsWith('0')) cleanDigits = '62' + cleanDigits.slice(1);
              if (cleanDigits.length >= 9) {
                waHref = `https://wa.me/${cleanDigits}?text=Halo%20saya%20ingin%20memesan%20makanan`;
              }
            }

            innerHTML = `
              <div id="section-contact" class="py-14 px-6 sm:px-12" style="background-color: ${theme.backgroundColor}; color: ${theme.textColor}; font-family: '${theme.bodyFont}', sans-serif;">
                <div class="max-w-3xl mx-auto text-center space-y-5">
                  <span class="text-xs font-bold uppercase tracking-wider" style="color: ${theme.primaryColor};">Layanan Pelanggan</span>
                  <h2 class="text-2xl sm:text-3xl font-bold" style="font-family: '${theme.headingFont}', Georgia, serif; color: ${theme.headingColor};">
                    ${escapeHtml(section.title || 'Hubungi Kami')}
                  </h2>
                  <p class="text-xs sm:text-sm" style="color: ${theme.textColor};">
                    ${escapeHtml(section.subtitle || 'Kami siap melayani kebutuhan pesanan dan konsultasi Anda')}
                  </p>
                  
                  <div class="rounded-2xl p-5 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto shadow-sm border" style="background-color: ${theme.cardBackground || '#f0fdf4'}; border-color: ${theme.primaryColor}35; color: ${theme.textColor};">
                    <div class="flex items-center justify-center gap-2 font-bold mb-1.5" style="color: ${theme.primaryColor};">
                      <i data-lucide="map-pin" class="w-4 h-4"></i>
                      <span>Informasi Alamat & Kontak:</span>
                    </div>
                    <p class="whitespace-pre-line font-medium" style="color: ${theme.textColor};">${escapeHtml(section.content || 'WhatsApp: 0812-xxxx-xxxx | Alamat: Toko Kami')}</p>
                  </div>

                  <div>
                    <a href="${waHref}" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl shadow-lg transition text-sm hover:opacity-90" style="background-color: ${theme.primaryColor};">
                      <i data-lucide="message-circle" class="w-4 h-4"></i>
                      <span>Chat Langsung via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            `;
            break;
          }

          case 'FOOTER': {
            const footerDark = theme.headingColor === '#0f172a' ? '#0f172a' : theme.headingColor;
            innerHTML = `
              <div class="py-8 px-6 sm:px-12 text-slate-300" style="background-color: ${footerDark}; font-family: '${theme.bodyFont}', sans-serif;">
                <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs">
                  <div>
                    <h4 class="font-bold text-white text-sm mb-0.5" style="font-family: '${theme.headingFont}', Georgia, serif;">${escapeHtml(section.title || 'Nama Usaha')}</h4>
                    <p class="text-slate-400 text-[11px]">${escapeHtml(section.subtitle || 'Hak Cipta © 2026. Seluruh hak cipta dilindungi.')}</p>
                    ${section.content ? `<p class="text-slate-400 text-[11px] mt-0.5">${escapeHtml(section.content)}</p>` : ''}
                  </div>
                  <div class="text-slate-400 text-[11px]">
                    Ditenagai oleh AI Website Builder • Tanpa Koding
                  </div>
                </div>
              </div>
            `;
            break;
          }
            break;

          default:
            innerHTML = `
              <div class="py-10 px-6 max-w-4xl mx-auto bg-white">
                <h3 class="text-lg font-bold text-slate-900">${escapeHtml(section.title || 'Bagian')}</h3>
                <p class="text-slate-600 text-xs mt-1">${escapeHtml(section.subtitle || '')}</p>
                <p class="text-slate-500 text-xs mt-2 whitespace-pre-line">${escapeHtml(section.content || '')}</p>
              </div>
            `;
        }

        secElement.innerHTML = controlsOverlay + innerHTML;
        wrapper.appendChild(secElement);

      } catch (secError) {
        console.error('Error saat merender section:', section, secError);
      }
    });

    setupCatalogDropTarget();

    // Pastikan daftar bagian aktif di sidebar selalu tersinkronisasi
    renderSidebarActiveSections();

    if (window.lucide) {
      window.lucide.createIcons();
    }

  } catch (err) {
    console.error('Error di dalam renderCanvas:', err);
    showToast('Terjadi kesalahan saat merender tampilan kanvas.', 'error');
  }
}

function setupCatalogDropTarget() {
  try {
    const dropTarget = document.getElementById('catalogDropTarget');
    const store = getStore();
    if (!dropTarget || !store) return;

    dropTarget.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      dropTarget.classList.add('drop-hover');
    });

    dropTarget.addEventListener('dragleave', () => {
      dropTarget.classList.remove('drop-hover');
    });

    dropTarget.addEventListener('drop', (e) => {
      try {
        e.preventDefault();
        dropTarget.classList.remove('drop-hover');

        const dragData = APP_STATE.draggedData;
        if (!dragData) return;

        if (dragData.type === 'PRODUCT' && dragData.product) {
          const p = dragData.product;
          const res = store.addProduct({
            name: p.name,
            price: p.price,
            category: p.category
          });

          if (res.success) {
            renderCanvas();
            renderSidebarItems();
            if (window.lucide) lucide.createIcons();
            showToast(`Item "${p.name}" berhasil di-drop dan masuk ke katalog kanvas!`, 'success');
          }
        }
      } catch (dropErr) {
        console.error('Error drop di katalog:', dropErr);
      }
    });

  } catch (err) {
    console.error('Error setupCatalogDropTarget:', err);
  }
}

function handleSectionDropAt(targetOrderIndex) {
  try {
    const store = getStore();
    const dragData = APP_STATE.draggedData;
    if (!dragData || dragData.type !== 'SECTION' || !store) return;

    const type = dragData.sectionType || 'ABOUT';
    const meta = SECTION_TYPE_METADATA[type] || SECTION_TYPE_METADATA.ABOUT;

    const res = store.insertSectionAt(targetOrderIndex, {
      type,
      title: meta.title.placeholder.replace('Contoh: ', ''),
      subtitle: meta.subtitle.placeholder.replace('Contoh: ', ''),
      content: meta.content.placeholder.replace('Contoh: ', '')
    });

    if (res.success) {
      renderCanvas();
      showToast(`Bagian ${type} berhasil disisipkan pada urutan #${targetOrderIndex}!`, 'success');
    }
  } catch (err) {
    console.error('Error handleSectionDropAt:', err);
  }
}

function escapeHtml(str) {
  try {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  } catch (e) {
    return str;
  }
}

// ======================================================================================
// Helper Append Pesan ke Panel Chat AI Kanan
function appendChatMessage(sender, text, meta = {}) {
  try {
    const list = document.getElementById('aiChatMessagesList');
    const greeting = document.getElementById('aiEmptyStateGreeting');
    if (greeting) greeting.classList.add('hidden');
    if (!list) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === 'user') {
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble-user';
      userBubble.innerHTML = `
        <div class="font-medium text-white">${escapeHtml(text)}</div>
        <div class="text-[9px] text-slate-300 text-right mt-1">${timeStr}</div>
      `;
      list.appendChild(userBubble);
    } else {
      const aiBubble = document.createElement('div');
      aiBubble.className = 'chat-bubble-ai';
      const sourceBadge = meta.source === 'GEMINI_API'
        ? '<span class="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 rounded">Gemini Flash</span>'
        : (meta.source === 'OFFLINE_FALLBACK'
            ? '<span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded">Smart Assistant</span>'
            : (meta.isError 
                ? '<span class="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded">Pemberitahuan</span>'
                : '<span class="text-[9px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">Asisten Copilot</span>'));

      aiBubble.innerHTML = `
        <div class="flex items-center justify-between gap-1 mb-1.5">
          <div class="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <span class="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">✨</span>
            <span>Gemini Copilot</span>
          </div>
          ${sourceBadge}
        </div>
        <div class="text-slate-700 text-xs leading-relaxed">${escapeHtml(text)}</div>
        <div class="text-[9px] text-slate-400 mt-1.5 text-right">${timeStr}</div>
      `;
      list.appendChild(aiBubble);
    }

    const scrollArea = document.getElementById('aiChatScrollArea');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  } catch (err) {
    console.error('Error appendChatMessage:', err);
  }
}

// 6. EKSEKUSI INTENT AI (PRD AC-4.2, AC-4.3, AC-4.4, Section 6)
// ======================================================================================
async function handlePromptSubmit(event) {
  try {
    if (event) event.preventDefault();

    if (APP_STATE.isAiProcessing) return;

    const promptInput = document.getElementById('promptInput');
    const store = getStore();
    const userPrompt = (promptInput?.value || '').trim();

    if (!userPrompt) {
      showToast('Silakan masukkan instruksi Anda terlebih dahulu.', 'warning');
      return;
    }
    if (!store) return;

    appendChatMessage('user', userPrompt);
    if (promptInput) {
      promptInput.value = '';
      promptInput.style.height = 'auto';
    }

    setAiLoadingState(true);

    const currentContext = {
      sectionsSummary: store.getSortedSections().map(s => ({ id: s.id, type: s.type, title: s.title })),
      productsSummary: store.getProducts().map(p => ({ id: p.id, name: p.name, price: p.price }))
    };

    const result = await sendPromptToGemini(userPrompt, currentContext);
    setAiLoadingState(false);

    if (!result || !result.success) {
      const errText = result?.error || 'Layanan AI sedang sibuk. Silakan coba perintah Anda beberapa saat lagi.';
      appendChatMessage('ai', 'Maaf, terjadi kendala: ' + errText, { isError: true });
      showToast(errText, 'error', 5000);
      return;
    }

    const intentData = result.data;
    console.log('Eksekusi AI Intent:', intentData, 'Sumber:', result.source);

    let executionSuccess = false;
    let messageText = '';

    const action = intentData.action ? intentData.action.toUpperCase() : 'UPDATE_SECTION';

    if (action === 'ADD_SECTION') {
      const secData = intentData.sectionData || {};
      const res = store.addSection(secData);
      executionSuccess = res.success;
      messageText = `Bagian ${secData.type || 'baru'} berhasil ditambahkan ke kanvas!`;

    } else if (action === 'UPDATE_SECTION') {
      const secData = intentData.sectionData || {};
      const targetId = intentData.targetId || secData.id;
      const res = store.updateSection({
        targetId: targetId,
        type: secData.type,
        title: secData.title,
        subtitle: secData.subtitle,
        content: secData.content,
        orderIndex: secData.orderIndex
      });
      executionSuccess = res.success;
      messageText = `Bagian ${secData.type || 'website'} berhasil diperbarui!`;

    } else if (action === 'DELETE_SECTION') {
      const target = intentData.targetId || intentData.sectionData?.type;
      const res = store.deleteSection(target);
      executionSuccess = res.success;
      messageText = `Bagian ${target} berhasil dihapus dari website.`;

    } else if (action === 'MANAGE_PRODUCT') {
      const prodOp = (intentData.productOperation || 'ADD').toUpperCase();
      const pData = intentData.productData || {};

      if (prodOp === 'ADD') {
        const res = store.addProduct(pData);
        executionSuccess = res.success;
        messageText = `Item "${pData.name}" berhasil masuk ke list dan ditampilkan!`;
      } else if (prodOp === 'UPDATE') {
        const res = store.updateProduct(intentData.targetId, pData);
        executionSuccess = res.success;
        messageText = `Item "${pData.name}" berhasil diperbarui.`;
      } else if (prodOp === 'DELETE') {
        const res = store.deleteProduct(intentData.targetId);
        executionSuccess = res.success;
        messageText = `Item berhasil dihapus dari list.`;
      }
    } else if (action === 'UPDATE_THEME') {
      const themeData = intentData.themeData || {};
      const res = store.updateTheme(themeData);
      executionSuccess = res.success;
      messageText = intentData.message || 'Gaya desain (warna & font) website berhasil diperbarui!';
    } else if (action === 'SET_DESIGN_TEMPLATE') {
      const templateId = intentData.templateId || 'modern-warung';
      const res = store.setDesignTemplate(templateId, true);
      executionSuccess = res.success;
      messageText = intentData.message || `Gaya desain template website berhasil diubah ke: ${res.template?.name || templateId}!`;
    } else {
      store.updateSection({
        type: 'HERO',
        content: userPrompt
      });
      executionSuccess = true;
      messageText = 'Perubahan website berhasil diterapkan.';
    }

    if (executionSuccess) {
      renderCanvas();
      appendChatMessage('ai', messageText, { source: result.source });
      const sourceLabel = result.source === 'GEMINI_API' ? ' (via Gemini Flash)' : (result.source === 'OFFLINE_FALLBACK' ? ' (Smart Assistant)' : ' (Demo Mode)');
      showToast(messageText + sourceLabel, 'success');
      if (promptInput) promptInput.value = '';
    } else {
      appendChatMessage('ai', 'Gagal memproses instruksi pada struktur website.', { isError: true });
      showToast('Gagal memproses instruksi pada struktur website.', 'warning');
    }

  } catch (err) {
    console.error('Error saat handlePromptSubmit:', err);
    setAiLoadingState(false);
    showToast('Layanan AI sedang sibuk. Silakan coba perintah Anda beberapa saat lagi.', 'error');
  }
}

function setAiLoadingState(isLoading) {
  try {
    APP_STATE.isAiProcessing = isLoading;
    const btnSubmit = document.getElementById('btnSubmitPrompt');
    const btnSubmitText = document.getElementById('btnSubmitText');
    const btnSubmitIcon = document.getElementById('btnSubmitIcon');
    const aiSpinner = document.getElementById('aiSpinner');
    const promptInput = document.getElementById('promptInput');
    const chatList = document.getElementById('aiChatMessagesList');

    if (isLoading) {
      if (btnSubmit) btnSubmit.disabled = true;
      if (btnSubmitText) btnSubmitText.textContent = 'Berpikir...';
      if (btnSubmitIcon) btnSubmitIcon.classList.add('hidden');
      if (aiSpinner) aiSpinner.classList.remove('hidden');
      if (promptInput) promptInput.disabled = true;

      // Tambahkan indikator mengetik halus jika belum ada
      if (chatList && !document.getElementById('aiTypingIndicator')) {
        const typingEl = document.createElement('div');
        typingEl.id = 'aiTypingIndicator';
        typingEl.className = 'chat-bubble-ai flex items-center gap-2 text-slate-500 py-2';
        typingEl.innerHTML = `
          <div class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
            <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 150ms;"></span>
            <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 300ms;"></span>
          </div>
          <span class="text-[11px] text-slate-500 font-medium">Gemini sedang meracik instruksi...</span>
        `;
        chatList.appendChild(typingEl);
        const scrollArea = document.getElementById('aiChatScrollArea');
        if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    } else {
      if (btnSubmit) btnSubmit.disabled = false;
      if (btnSubmitText) btnSubmitText.textContent = 'Kirim';
      if (btnSubmitIcon) btnSubmitIcon.classList.remove('hidden');
      if (aiSpinner) aiSpinner.classList.add('hidden');
      if (promptInput) promptInput.disabled = false;

      // Hapus indikator mengetik
      const typingEl = document.getElementById('aiTypingIndicator');
      if (typingEl) typingEl.remove();
    }
  } catch (e) {
    console.error('Error di setAiLoadingState:', e);
  }
}

// ======================================================================================
// 7. CONTROLS & EVENT HANDLERS
// ======================================================================================

function toggleViewMode() {
  try {
    APP_STATE.isEditorMode = !APP_STATE.isEditorMode;
    const aiPromptDock = document.getElementById('aiPromptDock');
    const floatingBtn = document.getElementById('btnFloatingOpenAiDock');
    const editorStatusBar = document.getElementById('editorStatusBar');
    const modeBtnText = document.getElementById('modeButtonText');
    const itemSidebar = document.getElementById('itemSidebar');
    const btnAddSectionManual = document.getElementById('btnAddSectionManual');
    const btnManageProducts = document.getElementById('btnManageProducts');
    const btnResetDemo = document.getElementById('btnResetDemo');

    if (!APP_STATE.isEditorMode) {
      if (itemSidebar) itemSidebar.classList.add('hidden');
      if (aiPromptDock) aiPromptDock.classList.add('is-collapsed');
      if (floatingBtn) floatingBtn.classList.add('hidden');
      if (editorStatusBar) editorStatusBar.classList.add('hidden');
      if (btnAddSectionManual) btnAddSectionManual.classList.add('hidden');
      if (btnManageProducts) btnManageProducts.classList.add('hidden');
      if (btnResetDemo) btnResetDemo.classList.add('hidden');
      if (modeBtnText) modeBtnText.textContent = 'Kembali ke Editor';
      showToast('Beralih ke Mode Preview Fullscreen.', 'info', 3000);
    } else {
      if (itemSidebar && APP_STATE.isSidebarOpen) itemSidebar.classList.remove('hidden');
      if (aiPromptDock && APP_STATE.isAiDockOpen) aiPromptDock.classList.remove('is-collapsed');
      if (floatingBtn && !APP_STATE.isAiDockOpen) floatingBtn.classList.remove('hidden');
      if (editorStatusBar) editorStatusBar.classList.remove('hidden');
      if (btnAddSectionManual) btnAddSectionManual.classList.remove('hidden');
      if (btnManageProducts) btnManageProducts.classList.remove('hidden');
      if (btnResetDemo) btnResetDemo.classList.remove('hidden');
      if (modeBtnText) modeBtnText.textContent = 'Preview Fullscreen';
      showToast('Beralih ke Mode Editor.', 'info', 2000);
    }

    renderCanvas();
  } catch (err) {
    console.error('Error saat toggleViewMode:', err);
  }
}

function toggleSidebar() {
  try {
    APP_STATE.isSidebarOpen = !APP_STATE.isSidebarOpen;
    const itemSidebar = document.getElementById('itemSidebar');
    if (!itemSidebar) return;

    if (APP_STATE.isSidebarOpen) {
      itemSidebar.classList.remove('hidden');
      showToast('Palet item dibuka.', 'info', 1500);
    } else {
      itemSidebar.classList.add('hidden');
      showToast('Palet item disembunyikan.', 'info', 1500);
    }
  } catch (e) {
    console.error('Error toggleSidebar:', e);
  }
}

// Kontrol Toggle Tampilkan / Sembunyikan Panel Chat AI Samping Kanan
function toggleAiPromptDock(forceOpen = null) {
  try {
    const dock = document.getElementById('aiPromptDock');
    const btnToggleText = document.getElementById('btnToggleAiDockText');
    const floatingBtn = document.getElementById('btnFloatingOpenAiDock');
    if (!dock) return;

    if (forceOpen !== null) {
      APP_STATE.isAiDockOpen = forceOpen;
    } else {
      APP_STATE.isAiDockOpen = !APP_STATE.isAiDockOpen;
    }

    if (APP_STATE.isAiDockOpen) {
      dock.classList.remove('is-collapsed');
      dock.classList.remove('hidden');
      if (btnToggleText) btnToggleText.textContent = 'Tutup Chat AI';
      if (floatingBtn) floatingBtn.classList.add('hidden');
      const input = document.getElementById('promptInput');
      if (input) setTimeout(() => input.focus(), 150);
      showToast('Panel Chat AI dibuka.', 'info', 1500);
    } else {
      dock.classList.add('is-collapsed');
      if (btnToggleText) btnToggleText.textContent = 'Buka Chat AI';
      if (floatingBtn) floatingBtn.classList.remove('hidden');
      showToast('Panel Chat AI disembunyikan. Kanvas kini terlihat penuh!', 'info', 2000);
    }
    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error('Error toggleAiPromptDock:', err);
  }
}

function handleMoveSection(id, direction) {
  try {
    const store = getStore();
    if (!store) return;
    const res = store.moveSection(id, direction);
    if (res.success) {
      renderCanvas();
      renderSidebar();
      showToast(`Urutan bagian berhasil digeser ke ${direction === 'UP' ? 'atas' : 'bawah'}.`, 'success', 2000);
    }
  } catch (err) {
    console.error('Error saat handleMoveSection:', err);
  }
}

function handleDeleteSection(id) {
  try {
    const store = getStore();
    if (!store) return;
    if (confirm('Apakah Anda yakin ingin menghapus bagian ini dari website?')) {
      const res = store.deleteSection(id);
      if (res.success) {
        renderCanvas();
        renderSidebar();
        showToast('Bagian berhasil dihapus.', 'info');
      } else {
        showToast(res.error || 'Gagal menghapus bagian.', 'error');
      }
    }
  } catch (err) {
    console.error('Error saat handleDeleteSection:', err);
  }
}

function openEditSectionModal(id) {
  try {
    const store = getStore();
    if (!store) return;
    const section = store.sections.find(s => s.id === id);
    if (!section) return;

    document.getElementById('editSectionId').value = section.id;
    const typeSelect = document.getElementById('editSectionType');
    if (typeSelect) typeSelect.value = section.type;

    // Adaptasikan field, hint, dan label sesuai tipe bagian yang sedang diedit
    updateSectionFormFields('edit', section.type);

    document.getElementById('editSectionTitle').value = section.title || '';
    document.getElementById('editSectionSubtitle').value = section.subtitle || '';

    // Pastikan tidak ada string JSON bocor jika tipe bukan NAVBAR
    let safeContent = section.content || '';
    if (section.type !== 'NAVBAR' && (safeContent.trim().startsWith('[') || safeContent.trim().startsWith('{"'))) {
      safeContent = '';
    }
    document.getElementById('editSectionContent').value = safeContent;

    // Jika tipe CONTACT, urai teks content ke dalam sub-field nomor telepon, alamat, dan jam buka
    if (section.type === 'CONTACT') {
      parseContactContentToFields('edit', safeContent);
    } else if (section.type === 'NAVBAR') {
      try {
        if (section.content && section.content.trim().startsWith('[')) {
          EDIT_NAV_LINKS = JSON.parse(section.content);
        } else {
          EDIT_NAV_LINKS = [
            { label: 'Beranda', target: '#hero' },
            { label: 'Tentang Kami', target: '#about' },
            { label: 'Daftar Menu', target: '#catalog' },
            { label: 'Kontak', target: '#contact' }
          ];
        }
      } catch (e) {
        EDIT_NAV_LINKS = [
          { label: 'Beranda', target: '#hero' },
          { label: 'Tentang Kami', target: '#about' },
          { label: 'Daftar Menu', target: '#catalog' },
          { label: 'Kontak', target: '#contact' }
        ];
      }
      renderNavLinksEditor('edit');
    }

    const modal = document.getElementById('modalEditSection');
    if (modal) modal.classList.remove('hidden');
  } catch (err) {
    console.error('Error saat openEditSectionModal:', err);
  }
}

function openQuickAddProductModal() {
  try {
    const modal = document.getElementById('modalManageProducts');
    if (modal) {
      modal.classList.remove('hidden');
      renderProductListTable();
      const input = document.getElementById('newProdName');
      if (input) setTimeout(() => input.focus(), 150);
    }
  } catch (e) {
    console.error('Error openQuickAddProductModal:', e);
  }
}

function renderProductListTable() {
  try {
    const tbody = document.getElementById('productListTableBody');
    const store = getStore();
    if (!tbody || !store) return;

    const products = store.getProducts();
    tbody.innerHTML = '';

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-4 text-center text-slate-400">Belum ada menu / item produk di dalam list.</td></tr>`;
      return;
    }

    products.forEach((p, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50';
      tr.innerHTML = `
        <td class="px-4 py-3 font-semibold text-slate-800">
          <span class="text-xs font-mono text-slate-400 mr-1.5">#${idx + 1}</span>
          ${escapeHtml(p.name)}
        </td>
        <td class="px-4 py-3 text-xs text-slate-500">${escapeHtml(p.category || 'Umum')}</td>
        <td class="px-4 py-3 font-bold text-brand-700">Rp ${Number(p.price || 0).toLocaleString('id-ID')}</td>
        <td class="px-4 py-3 text-right">
          <button 
            type="button" 
            onclick="handleDeleteProduct('${p.id}')" 
            class="text-rose-600 hover:text-rose-800 text-xs font-semibold p-1 hover:bg-rose-50 rounded"
          >
            Hapus
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error('Error saat renderProductListTable:', err);
  }
}

function handleDeleteProduct(id) {
  try {
    const store = getStore();
    if (!store) return;
    const res = store.deleteProduct(id);
    if (res.success) {
      renderProductListTable();
      renderCanvas();
      renderSidebarItems();
      if (window.lucide) lucide.createIcons();
      showToast('Item berhasil dihapus dari list kanvas dan palet.', 'info');
    }
  } catch (err) {
    console.error('Error handleDeleteProduct:', err);
  }
}

function checkApiKeyStatus() {
  try {
    const key = getActiveGeminiApiKey();
    const dot = document.getElementById('apiKeyDot');
    const ping = document.getElementById('apiKeyDotPing');
    const sourceInd = document.getElementById('activeSourceIndicator');

    if (key && key.trim() !== '' && !key.includes('MASUKKAN')) {
      if (dot) dot.className = 'relative inline-flex rounded-full h-2 w-2 bg-emerald-500';
      if (ping) ping.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75';
      if (sourceInd) {
        sourceInd.textContent = '• Status: API Key Terhubung';
        sourceInd.className = 'ml-1 text-emerald-600 font-semibold';
      }
    } else {
      if (dot) dot.className = 'relative inline-flex rounded-full h-2 w-2 bg-amber-500';
      if (ping) ping.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75';
      if (sourceInd) {
        sourceInd.textContent = '• Status: Demo Offline Interpreter Aktif';
        sourceInd.className = 'ml-1 text-amber-600 font-semibold';
      }
    }
  } catch (e) {
    console.error('Error checkApiKeyStatus:', e);
  }
}

// ======================================================================================
// 8. SETUP EVENT LISTENERS
// ======================================================================================
function setupEventListeners() {
  try {
    const aiForm = document.getElementById('aiPromptForm');
    if (aiForm) {
      aiForm.addEventListener('submit', handlePromptSubmit);
    }

    const pills = document.querySelectorAll('.quick-prompt-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        try {
          const promptInput = document.getElementById('promptInput');
          if (promptInput) {
            const textSpan = pill.querySelector('.truncate') || pill;
            promptInput.value = textSpan.textContent.trim();
            promptInput.style.height = 'auto';
            promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + 'px';
            promptInput.focus();
          }
        } catch (e) {
          console.error('Error quick prompt click:', e);
        }
      });
    });

    const tabItemsBtn = document.getElementById('tabItemsBtn');
    const tabSectionsBtn = document.getElementById('tabSectionsBtn');
    const tabItemsContent = document.getElementById('tabItemsContent');
    const tabSectionsContent = document.getElementById('tabSectionsContent');

    if (tabItemsBtn && tabSectionsBtn) {
      tabItemsBtn.addEventListener('click', () => {
        try {
          tabItemsContent.classList.remove('hidden');
          tabSectionsContent.classList.add('hidden');
          tabItemsBtn.className = 'flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-white text-slate-900 shadow-xs border border-slate-200/50';
          tabSectionsBtn.className = 'flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800';
        } catch (e) {
          console.error('Error tabItemsBtn:', e);
        }
      });

      tabSectionsBtn.addEventListener('click', () => {
        try {
          tabSectionsContent.classList.remove('hidden');
          tabItemsContent.classList.add('hidden');
          tabSectionsBtn.className = 'flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-white text-slate-900 shadow-xs border border-slate-200/50';
          tabItemsBtn.className = 'flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800';
        } catch (e) {
          console.error('Error tabSectionsBtn:', e);
        }
      });
    }

    const formQuickSidebarAdd = document.getElementById('formQuickSidebarAdd');
    if (formQuickSidebarAdd) {
      formQuickSidebarAdd.addEventListener('submit', (e) => {
        try {
          e.preventDefault();
          const store = getStore();
          if (!store) return;

          const nameInput = document.getElementById('quickItemName');
          const priceInput = document.getElementById('quickItemPrice');
          const categoryInput = document.getElementById('quickItemCategory');

          const name = (nameInput?.value || '').trim();
          const price = priceInput?.value || '0';
          const category = (categoryInput?.value || '').trim();

          const res = store.createAvailableItem({ name, price, category });
          if (res.success) {
            formQuickSidebarAdd.reset();
            renderSidebarItems();
            showToast(`Item "${name}" siap di-drag ke kanvas!`, 'success');
          }
        } catch (err) {
          console.error('Error formQuickSidebarAdd:', err);
        }
      });
    }

    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    if (btnToggleSidebar) {
      btnToggleSidebar.addEventListener('click', toggleSidebar);
    }

    // Toggle Bilah Prompt AI dari Header Atas
    const btnToggleAiDock = document.getElementById('btnToggleAiDock');
    if (btnToggleAiDock) {
      btnToggleAiDock.addEventListener('click', () => toggleAiPromptDock());
    }

    // Tombol Tutup Silang di dalam Header Panel Chat AI
    const btnMinimizeAiDock = document.getElementById('btnMinimizeAiDock');
    if (btnMinimizeAiDock) {
      btnMinimizeAiDock.addEventListener('click', () => toggleAiPromptDock(false));
    }

    // Tombol Melayang untuk Membuka Kembali Chat AI
    const btnFloatingOpenAiDock = document.getElementById('btnFloatingOpenAiDock');
    if (btnFloatingOpenAiDock) {
      btnFloatingOpenAiDock.addEventListener('click', () => toggleAiPromptDock(true));
    }

    // Tombol Bersihkan Riwayat Chat AI
    const btnAiClearChat = document.getElementById('btnAiClearChat');
    if (btnAiClearChat) {
      btnAiClearChat.addEventListener('click', () => {
        try {
          const list = document.getElementById('aiChatMessagesList');
          const greeting = document.getElementById('aiEmptyStateGreeting');
          if (list) list.innerHTML = '';
          if (greeting) greeting.classList.remove('hidden');
          showToast('Riwayat percakapan dibersihkan.', 'info', 1500);
        } catch (e) {
          console.error('Error btnAiClearChat:', e);
        }
      });
    }

    // Tombol Tutup Disclaimer AI
    const btnCloseDisclaimer = document.getElementById('btnCloseDisclaimer');
    if (btnCloseDisclaimer) {
      btnCloseDisclaimer.addEventListener('click', () => {
        try {
          const disclaimer = document.getElementById('aiDisclaimerBox');
          if (disclaimer) disclaimer.classList.add('hidden');
        } catch (e) {
          console.error('Error btnCloseDisclaimer:', e);
        }
      });
    }

    // Link Kelola Key dari Chat
    const linkOpenApiFromChat = document.getElementById('linkOpenApiFromChat');
    if (linkOpenApiFromChat) {
      linkOpenApiFromChat.addEventListener('click', (e) => {
        try {
          e.preventDefault();
          const modal = document.getElementById('modalApiSettings');
          if (modal) modal.classList.remove('hidden');
        } catch (err) {
          console.error('Error linkOpenApiFromChat:', err);
        }
      });
    }

    // Tombol Plus Bantuan Cepat di Form Prompt
    const btnQuickHelpPrompt = document.getElementById('btnQuickHelpPrompt');
    if (btnQuickHelpPrompt) {
      btnQuickHelpPrompt.addEventListener('click', () => {
        try {
          const input = document.getElementById('promptInput');
          if (input) {
            input.value = 'Tambah menu minuman baru Es Cendol Nangka harga 18000';
            input.focus();
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
          }
        } catch (e) {
          console.error('Error btnQuickHelpPrompt:', e);
        }
      });
    }

    // Textarea promptInput: auto-expand & enter to submit
    const promptInputEl = document.getElementById('promptInput');
    if (promptInputEl) {
      promptInputEl.addEventListener('input', () => {
        promptInputEl.style.height = 'auto';
        promptInputEl.style.height = Math.min(promptInputEl.scrollHeight, 120) + 'px';
      });

      promptInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handlePromptSubmit(e);
        }
      });
    }

    const btnToggleMode = document.getElementById('btnToggleMode');
    if (btnToggleMode) {
      btnToggleMode.addEventListener('click', toggleViewMode);
    }

    const btnResetDemo = document.getElementById('btnResetDemo');
    if (btnResetDemo) {
      btnResetDemo.addEventListener('click', () => {
        try {
          const store = getStore();
          if (!store) return;
          if (confirm('Kembalikan semua data komponen dan produk ke seed data awal?')) {
            const res = store.resetDemoData();
            if (res.success) {
              renderSidebar();
              renderCanvas();
              showToast('Data demo berhasil direset ke kondisi awal.', 'success');
            }
          }
        } catch (e) {
          console.error('Error reset demo:', e);
        }
      });
    }

    // =========================================================================
    // EVENT LISTENER PERUBAHAN TIPE BAGIAN UNTUK ADAPTASI HINT SECARA REAL-TIME
    // =========================================================================
    const addSectionType = document.getElementById('addSectionType');
    if (addSectionType) {
      addSectionType.addEventListener('change', () => {
        updateSectionFormFields('add', addSectionType.value);
      });
    }

    const editSectionType = document.getElementById('editSectionType');
    if (editSectionType) {
      editSectionType.addEventListener('change', () => {
        updateSectionFormFields('edit', editSectionType.value);
      });
    }

    // Modal Tambah Section Manual (D3)
    const btnAddSectionManual = document.getElementById('btnAddSectionManual');
    const modalAddSection = document.getElementById('modalAddSection');
    const formAddSection = document.getElementById('formAddSection');
    if (btnAddSectionManual && modalAddSection) {
      btnAddSectionManual.addEventListener('click', () => {
        // Reset form dan pastikan semua input bersih tanpa sisa nilai sebelumnya
        if (formAddSection) formAddSection.reset();
        if (addSectionType) addSectionType.value = 'HERO';

        const titleInput = document.getElementById('addSectionTitle');
        const subInput = document.getElementById('addSectionSubtitle');
        const contentInput = document.getElementById('addSectionContent');
        if (titleInput) titleInput.value = '';
        if (subInput) subInput.value = '';
        if (contentInput) contentInput.value = '';

        const phone = document.getElementById('addContactPhone');
        const addr = document.getElementById('addContactAddress');
        const hours = document.getElementById('addContactHours');
        if (phone) phone.value = '';
        if (addr) addr.value = '';
        if (hours) hours.value = '';

        ADD_NAV_LINKS = [
          { label: 'Beranda', target: '#hero' },
          { label: 'Tentang Kami', target: '#about' },
          { label: 'Daftar Menu', target: '#catalog' },
          { label: 'Kontak', target: '#contact' }
        ];

        updateSectionFormFields('add', 'HERO');
        modalAddSection.classList.remove('hidden');
      });
    }
    if (formAddSection) {
      formAddSection.addEventListener('submit', (e) => {
        try {
          e.preventDefault();
          const store = getStore();
          if (!store) return;

          const type = document.getElementById('addSectionType').value;
          const title = document.getElementById('addSectionTitle').value;
          const subtitle = document.getElementById('addSectionSubtitle').value;
          let content = document.getElementById('addSectionContent').value;

          // Jika tipe NAVBAR, pastikan content tersusun dari dropdown
          if (type === 'NAVBAR') {
            syncNavLinksToContent('add');
            content = document.getElementById('addSectionContent').value;
          }

          // Jika tipe CONTACT, pastikan content tersusun rapi jika belum terisi manual
          if (type === 'CONTACT') {
            const phone = (document.getElementById('addContactPhone')?.value || '').trim();
            const addr = (document.getElementById('addContactAddress')?.value || '').trim();
            const hours = (document.getElementById('addContactHours')?.value || '').trim();
            if (phone || addr || hours) {
              const parts = [];
              if (phone) parts.push(`WhatsApp: ${phone}`);
              if (addr) parts.push(`Alamat: ${addr}`);
              if (hours) parts.push(`Buka: ${hours}`);
              content = parts.join(' | ');
            }
          }

          const res = store.addSection({ type, title, subtitle, content });
          if (res.success) {
            renderCanvas();
            renderSidebar();
            modalAddSection.classList.add('hidden');
            formAddSection.reset();
            showToast(`Bagian ${type} berhasil ditambahkan dan ditampilkan!`, 'success');
          }
        } catch (e) {
          console.error('Error submit formAddSection:', e);
        }
      });
    }

    // Modal Edit Section Manual
    const modalEditSection = document.getElementById('modalEditSection');
    const formEditSection = document.getElementById('formEditSection');
    if (formEditSection) {
      formEditSection.addEventListener('submit', (e) => {
        try {
          e.preventDefault();
          const store = getStore();
          if (!store) return;

          const id = document.getElementById('editSectionId').value;
          const type = document.getElementById('editSectionType').value;
          const title = document.getElementById('editSectionTitle').value;
          const subtitle = document.getElementById('editSectionSubtitle').value;
          let content = document.getElementById('editSectionContent').value;

          if (type === 'NAVBAR') {
            syncNavLinksToContent('edit');
            content = document.getElementById('editSectionContent').value;
          } else if (type === 'CONTACT') {
            const phone = (document.getElementById('editContactPhone')?.value || '').trim();
            const addr = (document.getElementById('editContactAddress')?.value || '').trim();
            const hours = (document.getElementById('editContactHours')?.value || '').trim();
            if (phone || addr || hours) {
              const parts = [];
              if (phone) parts.push(`WhatsApp: ${phone}`);
              if (addr) parts.push(`Alamat: ${addr}`);
              if (hours) parts.push(`Buka: ${hours}`);
              content = parts.join(' | ');
            }
          }

          const res = store.updateSection({
            targetId: id,
            type,
            title,
            subtitle,
            content
          });

          if (res.success) {
            renderCanvas();
            renderSidebar();
            modalEditSection.classList.add('hidden');
            showToast('Perubahan bagian berhasil disimpan!', 'success');
          }
        } catch (e) {
          console.error('Error submit formEditSection:', e);
        }
      });
    }

    const btnManageProducts = document.getElementById('btnManageProducts');
    const modalManageProducts = document.getElementById('modalManageProducts');
    const formAddProduct = document.getElementById('formAddProduct');
    if (btnManageProducts && modalManageProducts) {
      btnManageProducts.addEventListener('click', () => {
        renderProductListTable();
        modalManageProducts.classList.remove('hidden');
      });
    }
    if (formAddProduct) {
      formAddProduct.addEventListener('submit', (e) => {
        try {
          e.preventDefault();
          const store = getStore();
          if (!store) return;

          const nameInput = document.getElementById('newProdName');
          const priceInput = document.getElementById('newProdPrice');
          const categoryInput = document.getElementById('newProdCategory');

          const name = (nameInput?.value || '').trim();
          const price = priceInput?.value || '0';
          const category = (categoryInput?.value || '').trim();

          const res = store.addProduct({ name, price, category });
          if (res.success) {
            formAddProduct.reset();
            renderProductListTable();
            renderCanvas();
            renderSidebarItems();
            if (window.lucide) lucide.createIcons();
            showToast(`Item "${name}" berhasil masuk ke list kanvas dan palet item!`, 'success');
          }
        } catch (e) {
          console.error('Error submit formAddProduct:', e);
        }
      });
    }

    const btnOpenApiSettings = document.getElementById('btnOpenApiSettings');
    const modalApiSettings = document.getElementById('modalApiSettings');
    const formApiSettings = document.getElementById('formApiSettings');
    const inputApiKey = document.getElementById('inputApiKey');
    const btnClearApiKey = document.getElementById('btnClearApiKey');

    if (btnOpenApiSettings && modalApiSettings) {
      btnOpenApiSettings.addEventListener('click', () => {
        try {
          if (inputApiKey) {
            inputApiKey.value = getActiveGeminiApiKey();
          }
          modalApiSettings.classList.remove('hidden');
        } catch (e) {
          console.error('Error open API settings:', e);
        }
      });
    }

    if (formApiSettings) {
      formApiSettings.addEventListener('submit', (e) => {
        try {
          e.preventDefault();
          const keyVal = (inputApiKey?.value || '').trim();
          setActiveGeminiApiKey(keyVal);
          checkApiKeyStatus();
          modalApiSettings.classList.add('hidden');
          showToast('API Key Google AI Studio berhasil disimpan!', 'success');
        } catch (e) {
          console.error('Error submit formApiSettings:', e);
        }
      });
    }

    if (btnClearApiKey) {
      btnClearApiKey.addEventListener('click', () => {
        try {
          setActiveGeminiApiKey('');
          if (inputApiKey) inputApiKey.value = '';
          checkApiKeyStatus();
          showToast('API Key tersimpan telah dihapus.', 'info');
        } catch (e) {
          console.error('Error clear API key:', e);
        }
      });
    }

    // Tombol Tambah Baris Menu Navigasi (Add Modal)
    const btnAddNavRowAdd = document.getElementById('btnAddNavRowAdd');
    if (btnAddNavRowAdd) {
      btnAddNavRowAdd.addEventListener('click', () => {
        try {
          ADD_NAV_LINKS.push({ label: 'Menu Baru', target: '#catalog' });
          renderNavLinksEditor('add');
        } catch (e) {
          console.error('Error btnAddNavRowAdd:', e);
        }
      });
    }

    // Tombol Tambah Baris Menu Navigasi (Edit Modal)
    const btnAddNavRowEdit = document.getElementById('btnAddNavRowEdit');
    if (btnAddNavRowEdit) {
      btnAddNavRowEdit.addEventListener('click', () => {
        try {
          EDIT_NAV_LINKS.push({ label: 'Menu Baru', target: '#catalog' });
          renderNavLinksEditor('edit');
        } catch (e) {
          console.error('Error btnAddNavRowEdit:', e);
        }
      });
    }

    const closeButtons = document.querySelectorAll('.btnCloseModal');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
        } catch (e) {
          console.error('Error close modal:', e);
        }
      });
    });

  } catch (err) {
    console.error('Error saat setupEventListeners:', err);
  }
}

// Inisialisasi Aplikasi Utama


// Inisialisasi Aplikasi Utama
function initApp() {
  try {
    initAuthentication();
    setupEventListeners();
    initThemeSettings();
    initDesignTemplates();
    checkApiKeyStatus();
    renderSidebar();
    renderCanvas();
    // Default form fields setup
    updateSectionFormFields('add', 'ABOUT');
    updateSectionFormFields('edit', 'HERO');
  } catch (err) {
    console.error('Error saat inisialisasi aplikasi:', err);
  }
}

// Jalankan segera saat file dimuat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
