'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Compass,
  ArrowRight,
  Check,
  Link,
  Layers
} from 'lucide-react';
import {
  CanvasElement,
  AdvanceCanvas,
  NavItemData
} from '@/lib/advanceTypes';

export interface AdvanceNavigationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNavElement: CanvasElement | null;
  allCanvases: AdvanceCanvas[];
  onSaveNavItems: (navItems: NavItemData[], navBrand: string) => void;
}

export default function AdvanceNavigationConfigModal({
  isOpen,
  onClose,
  selectedNavElement,
  allCanvases,
  onSaveNavItems
}: AdvanceNavigationConfigModalProps) {
  if (!isOpen || !selectedNavElement) return null;

  const [brandName, setBrandName] = useState(
    selectedNavElement.properties.navBrand || 'Toko Saya'
  );

  const [items, setItems] = useState<NavItemData[]>(
    selectedNavElement.properties.navItems && selectedNavElement.properties.navItems.length > 0
      ? [...selectedNavElement.properties.navItems]
      : [
          { id: 'nav-1', label: 'Beranda', targetCanvasId: allCanvases[0]?.id },
          { id: 'nav-2', label: 'Tentang Kami', targetCanvasId: allCanvases[1]?.id || allCanvases[0]?.id },
          { id: 'nav-3', label: 'Produk', targetCanvasId: allCanvases[2]?.id || allCanvases[0]?.id },
          { id: 'nav-4', label: 'Kontak', targetCanvasId: allCanvases[allCanvases.length - 1]?.id }
        ]
  );

  // AC-NAV-02: Tekan tombol Tambah Menu (+) untuk menambah tautan baru
  const handleAddItem = () => {
    const newId = `nav-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        label: `Menu ${prev.length + 1}`,
        targetCanvasId: allCanvases[0]?.id
      }
    ]);
  };

  const handleUpdateItem = (id: string, updates: Partial<NavItemData>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    onSaveNavItems(items, brandName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Konfigurasi Menu Navigasi
              </h3>
              <p className="text-xs text-slate-500">
                Atur nama menu dan arahkan target kanvas tujuan saat diklik (AC-NAV-02)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* Brand/Logo Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nama Toko / Brand di Navbar
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Dapoer Berkah"
            />
          </div>

          {/* Daftar Item Menu */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Daftar Tautan Menu & Target Kanvas</span>
              </label>
              {/* Tombol Tambah Menu (+) */}
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 border border-blue-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Menu (+)</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center gap-2.5 hover:border-slate-300 transition"
                >
                  <span className="w-5 text-center text-xs font-bold text-slate-400">
                    {idx + 1}.
                  </span>

                  {/* Input Nama Menu */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                      placeholder="Nama Menu"
                      className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Dropdown Target Kanvas Tujuan */}
                  <div className="w-44">
                    <select
                      value={item.targetCanvasId || allCanvases[0]?.id}
                      onChange={(e) => handleUpdateItem(item.id, { targetCanvasId: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      title="Pilih Target Kanvas"
                    >
                      {allCanvases.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title || `Kanvas ${c.pageIndex}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tombol Hapus Menu */}
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Hapus Menu Ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {items.length === 0 && (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                  Belum ada tautan menu. Klik <strong>+ Tambah Menu</strong> di atas.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
