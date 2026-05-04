'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, PlusCircle, Images,
  Upload, X, Trash2, Pencil, Check, ChevronDown,
  GripVertical, AlertCircle,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

// ─── Types ─────────────────────────────────────────────────────
interface GalleryImage {
  id:        string;
  site:      string;
  section:   string;
  imageUrl:  string;
  caption:   string | null;
  sortOrder: number;
  createdAt: string;
}

// ─── Config ────────────────────────────────────────────────────
const SITES = [
  { value: 'cnr_group',    label: 'CNR Group',       color: 'bg-slate-100 text-slate-700' },
  { value: 'cac_audit',    label: 'CAC Audit',        color: 'bg-blue-100 text-blue-700' },
  { value: 'nr_advisory',  label: 'NR Advisory',      color: 'bg-amber-100 text-amber-700' },
  { value: 'nr_accounting',label: 'NR Accounting',    color: 'bg-green-100 text-green-700' },
  { value: 'model_mix',    label: 'Model Mix',        color: 'bg-orange-100 text-orange-700' },
];

const SECTIONS_BY_SITE: Record<string, { value: string; label: string }[]> = {
  cnr_group:     [
    { value: 'TESTIMONIALS', label: 'Testimonials (รีวิวลูกค้า)' },
    { value: 'AWARDS',       label: 'Awards (รางวัล)' },
  ],
  cac_audit:     [
    { value: 'INDUSTRIES',   label: 'Industries (กลุ่มธุรกิจ)' },
    { value: 'AWARDS',       label: 'Awards (รางวัล)' },
  ],
  nr_advisory:   [
    { value: 'AWARDS',       label: 'Awards (รางวัล)' },
  ],
  nr_accounting: [
    { value: 'AWARDS',       label: 'Awards (รางวัล)' },
  ],
  model_mix:     [
    { value: 'CERTIFICATIONS', label: 'Certifications (ใบรับรอง)' },
  ],
};



// ─── Drag-and-drop Upload Zone ─────────────────────────────────
function UploadZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (files.length) onFiles(files);
    },
    [onFiles],
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
        dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
      }`}
    >
      <Upload size={36} className="mx-auto text-gray-300 mb-4" />
      <p className="font-semibold text-gray-600">ลากวางรูปภาพที่นี่</p>
      <p className="text-sm text-gray-400 mt-1">หรือคลิกเพื่อเลือกไฟล์ (รองรับหลายไฟล์) · JPG, PNG, WebP · สูงสุด 15 MB/ไฟล์</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ─── Upload Preview Card ───────────────────────────────────────
function UploadPreviewCard({
  file,
  caption,
  onCaptionChange,
  onRemove,
}: {
  file: File;
  caption: string;
  onCaptionChange: (v: string) => void;
  onRemove: () => void;
}) {
  const [preview] = useState(() => URL.createObjectURL(file));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="relative aspect-video bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt={file.name} className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow"
        >
          <X size={14} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 truncate mb-2">{file.name}</p>
        <input
          type="text"
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="คำอธิบายรูป (ถ้ามี)..."
          className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

// ─── Image Card (existing) ─────────────────────────────────────
function ImageCard({
  image,
  onDelete,
  onUpdateCaption,
}: {
  image: GalleryImage;
  onDelete: (id: string) => void;
  onUpdateCaption: (id: string, caption: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(image.caption ?? '');
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    await onUpdateCaption(image.id, caption);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('ลบรูปนี้?')) return;
    setDeleting(true);
    await onDelete(image.id);
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group transition-all hover:shadow-md ${deleting ? 'opacity-50' : ''}`}>
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.imageUrl} alt={image.caption ?? 'Gallery image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 bg-white text-gray-600 rounded-full shadow hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 bg-white text-gray-600 rounded-full shadow hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <Trash2 size={13} />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
          #{image.sortOrder + 1}
        </div>
      </div>
      <div className="p-3">
        {editing ? (
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="flex-1 text-xs px-2 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
            />
            <button onClick={handleSave} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Check size={13} />
            </button>
            <button onClick={() => setEditing(false)} className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors">
              <X size={13} />
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-500 truncate min-h-[1.25rem]">
            {image.caption || <span className="text-gray-300 italic">ไม่มีคำอธิบาย</span>}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Gallery Admin Page ───────────────────────────────────
export default function GalleryAdminPage() {
  const [selectedSite,    setSelectedSite]    = useState('cnr_group');
  const [selectedSection, setSelectedSection] = useState('TESTIMONIALS');
  const [images,          setImages]          = useState<GalleryImage[]>([]);
  const [loading,         setLoading]         = useState(false);
  const [uploading,       setUploading]       = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [successMsg,      setSuccessMsg]      = useState<string | null>(null);

  // Pending uploads (file + caption)
  const [pendingFiles, setPendingFiles] = useState<{ file: File; caption: string }[]>([]);

  // Sections available for selected site
  const sections = SECTIONS_BY_SITE[selectedSite] ?? [];

  // When site changes, reset section
  useEffect(() => {
    const secs = SECTIONS_BY_SITE[selectedSite] ?? [];
    if (secs.length) setSelectedSection(secs[0].value);
  }, [selectedSite]);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`/api/v1/gallery?site=${selectedSite}&section=${selectedSection}`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch {
      setError('ไม่สามารถโหลดรูปภาพได้');
    } finally {
      setLoading(false);
    }
  }, [selectedSite, selectedSection]);

  useEffect(() => { loadImages(); }, [loadImages]);

  const handleFiles = useCallback((files: File[]) => {
    setPendingFiles((prev) => [
      ...prev,
      ...files.map((file) => ({ file, caption: '' })),
    ]);
  }, []);

  const handleUpload = async () => {
    if (!pendingFiles.length) return;
    setUploading(true);
    setError(null);
    let successCount = 0;

    for (let i = 0; i < pendingFiles.length; i++) {
      const { file, caption } = pendingFiles[i];
      const fd = new FormData();
      fd.append('image',     file);
      fd.append('site',      selectedSite);
      fd.append('section',   selectedSection);
      fd.append('caption',   caption);
      fd.append('sortOrder', String(images.length + i));

      try {
        const res = await fetch('/api/v1/gallery', { method: 'POST', body: fd });
        if (!res.ok) {
          const msg = await res.json().catch(() => ({}));
          throw new Error(msg?.error ?? `HTTP ${res.status}`);
        }
        successCount++;
      } catch (err: any) {
        setError(`อัพโหลด ${file.name} ล้มเหลว: ${err.message}`);
      }
    }

    setPendingFiles([]);
    setUploading(false);
    if (successCount > 0) {
      setSuccessMsg(`อัพโหลดสำเร็จ ${successCount} รูป`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
    loadImages();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/v1/gallery/${id}`, { method: 'DELETE' });
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUpdateCaption = async (id: string, caption: string) => {
    await fetch(`/api/v1/gallery/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ caption }),
    });
    setImages((prev) => prev.map((img) => img.id === id ? { ...img, caption } : img));
  };

  const siteMeta  = SITES.find((s) => s.value === selectedSite);
  const secMeta   = sections.find((s) => s.value === selectedSection);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Images size={24} className="text-blue-600" />
                จัดการรูปภาพ
              </h2>
              <p className="text-gray-500 mt-1">เพิ่ม/แก้ไข/ลบรูปภาพในแต่ละ Section ของทุกเว็บไซต์</p>
            </div>
          </div>

          {/* Site + Section Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Site */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">เว็บไซต์</label>
                <div className="flex flex-wrap gap-2">
                  {SITES.map((site) => (
                    <button
                      key={site.value}
                      onClick={() => setSelectedSite(site.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                        selectedSite === site.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {site.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Section / หัวข้อ</label>
                <div className="flex flex-wrap gap-2">
                  {sections.map((sec) => (
                    <button
                      key={sec.value}
                      onClick={() => setSelectedSection(sec.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                        selectedSection === sec.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                  {sections.length === 0 && (
                    <p className="text-sm text-gray-400 italic">ไม่มี section ที่รองรับสำหรับเว็บนี้</p>
                  )}
                </div>
              </div>
            </div>

            {/* Current selection badge */}
            {siteMeta && secMeta && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${siteMeta.color}`}>{siteMeta.label}</span>
                <span className="text-gray-400">›</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">{secMeta.label}</span>
                <span className="text-xs text-gray-400 ml-auto">{images.length} รูป</span>
              </div>
            )}
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 flex items-center gap-2 text-sm">
              <Check size={16} className="shrink-0" /> {successMsg}
            </div>
          )}

          {/* Upload Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Upload size={18} className="text-blue-500" />
              เพิ่มรูปภาพใหม่
              {pendingFiles.length > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingFiles.length} ไฟล์รอ
                </span>
              )}
            </h3>

            <UploadZone onFiles={handleFiles} />

            {/* Pending files preview */}
            {pendingFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">รูปที่รอ Upload ({pendingFiles.length} ไฟล์)</p>
                  <button
                    onClick={() => setPendingFiles([])}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ล้างทั้งหมด
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
                  {pendingFiles.map(({ file, caption }, idx) => (
                    <UploadPreviewCard
                      key={`${file.name}-${idx}`}
                      file={file}
                      caption={caption}
                      onCaptionChange={(v) => setPendingFiles((prev) =>
                        prev.map((p, i) => i === idx ? { ...p, caption: v } : p)
                      )}
                      onRemove={() => setPendingFiles((prev) => prev.filter((_, i) => i !== idx))}
                    />
                  ))}
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  {uploading ? 'กำลัง Upload...' : `Upload ${pendingFiles.length} รูป ไปยัง ${siteMeta?.label} › ${secMeta?.label}`}
                </button>
              </div>
            )}
          </div>

          {/* Existing images */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Images size={18} className="text-purple-500" />
                รูปภาพปัจจุบัน
                <span className="text-xs font-normal text-gray-400">({images.length} รูป)</span>
              </h3>
              <button
                onClick={loadImages}
                className="text-xs text-blue-600 hover:underline"
              >
                รีเฟรช
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-video bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="py-16 text-center">
                <Images size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium">ยังไม่มีรูปภาพใน Section นี้</p>
                <p className="text-sm text-gray-300 mt-1">ลากวางรูปในช่องด้านบนเพื่อเริ่มเพิ่มรูป</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((img) => (
                  <ImageCard
                    key={img.id}
                    image={img}
                    onDelete={handleDelete}
                    onUpdateCaption={handleUpdateCaption}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
    </AdminLayout>
  );
}
