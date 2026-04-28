'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  Bold, Italic, List, ListOrdered, Link2, Heading2, Heading3,
  Undo, Redo, Upload, X, Save, Send, ArrowLeft, ImageIcon,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────
interface PostFormData {
  title:      string;
  summary:    string;
  category:   string;
  department: string;
  status:     string;
}

interface PostEditorProps {
  /** Pass existing post data when editing */
  initialData?: PostFormData & { id: string; content: string; thumbnailUrl?: string };
}

// ─── Slug Auto-generate ───────────────────────────────────────
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80);
}

// ─── Rich Text Toolbar ────────────────────────────────────────
function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const btn = (active: boolean) =>
    `p-2 rounded-lg transition-colors ${
      active
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
    }`;

  const addLink = () => {
    const url = prompt('URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      <button onClick={() => editor.chain().focus().undo().run()} className={btn(false)} title="Undo"><Undo size={16} /></button>
      <button onClick={() => editor.chain().focus().redo().run()} className={btn(false)} title="Redo"><Redo size={16} /></button>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))} title="H2"><Heading2 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))} title="H3"><Heading3 size={16} /></button>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Bold"><Bold size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Italic"><Italic size={16} /></button>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}><List size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}><ListOrdered size={16} /></button>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <button onClick={addLink} className={btn(editor.isActive('link'))} title="Insert Link"><Link2 size={16} /></button>
    </div>
  );
}

// ─── Drag & Drop Thumbnail Upload ─────────────────────────────
function ThumbnailUploader({
  preview,
  onFile,
  onClear,
}: {
  preview?: string;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) onFile(file);
    },
    [onFile],
  );

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        <ImageIcon size={14} className="inline mr-1" /> รูปหน้าปก (Thumbnail)
      </label>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Thumbnail preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <Upload size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-600">ลากวางรูปภาพที่นี่</p>
          <p className="text-xs text-gray-400 mt-1">หรือคลิกเพื่อเลือกไฟล์ (JPG, PNG, WebP · สูงสุด 10 MB)</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────
export default function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState<PostFormData>({
    title:      initialData?.title      ?? '',
    summary:    initialData?.summary    ?? '',
    category:   initialData?.category   ?? 'NEWS',
    department: initialData?.department ?? 'audit',
    status:     initialData?.status     ?? 'DRAFT',
  });

  const [slug,         setSlug]         = useState(toSlug(initialData?.title ?? ''));
  const [thumbnail,    setThumbnail]    = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | undefined>(initialData?.thumbnailUrl);
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: initialData?.content ?? '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[320px] p-4 focus:outline-none',
      },
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit) setSlug(toSlug(form.title));
  }, [form.title, isEdit]);

  const handleFile = useCallback((file: File) => {
    setThumbnail(file);
    setThumbPreview(URL.createObjectURL(file));
  }, []);

  const handleSubmit = async (submitStatus: 'DRAFT' | 'PUBLISHED') => {
    if (!form.title.trim())   { setError('กรุณากรอกหัวข้อบทความ'); return; }
    if (!form.summary.trim()) { setError('กรุณากรอกบทสรุป');       return; }
    if (!editor?.getText())   { setError('กรุณากรอกเนื้อหา');      return; }

    setSaving(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('title',      form.title);
      fd.append('summary',    form.summary);
      fd.append('content',    editor.getHTML());
      fd.append('category',   form.category);
      fd.append('department', form.department);
      fd.append('status',     submitStatus);
      if (thumbnail) fd.append('thumbnail', thumbnail);

      const url    = isEdit ? `/api/v1/posts/${initialData!.id}` : '/api/v1/posts';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, { method, body: fd });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error ?? `HTTP ${res.status}`);
      }

      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-900">
                {isEdit ? 'แก้ไขบทความ' : 'บทความใหม่'}
              </h1>
              <p className="text-xs text-gray-400 font-mono">/news/{slug || '...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit('DRAFT')}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Save size={16} /> บันทึก Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('PUBLISHED')}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
            >
              <Send size={16} /> {saving ? 'กำลังบันทึก...' : 'เผยแพร่'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center gap-2">
            <X size={16} className="shrink-0" /> {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Left: Main Editor */}
          <div className="space-y-6">
            {/* Title */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <input
                type="text"
                placeholder="หัวข้อบทความ..."
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none resize-none"
              />
              {/* Slug Preview */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">Slug:</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 outline-none focus:ring-1 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">บทสรุป (Summary)</label>
              <textarea
                rows={3}
                placeholder="สรุปย่อเนื้อหาบทความ (แสดงบนการ์ดข่าว)..."
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                className="w-full text-gray-700 border border-gray-200 rounded-xl p-3 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <label className="block px-6 pt-5 pb-3 text-sm font-semibold text-gray-700 border-b border-gray-100">
                เนื้อหาบทความ
              </label>
              <Toolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Right: Settings */}
          <div className="space-y-4">
            {/* Thumbnail */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <ThumbnailUploader
                preview={thumbPreview}
                onFile={handleFile}
                onClear={() => { setThumbnail(null); setThumbPreview(undefined); }}
              />
            </div>

            {/* Meta Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
              <h3 className="font-bold text-gray-800 text-sm">การตั้งค่า</h3>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">แผนก</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="audit">CAC Audit</option>
                  <option value="accounting">NR Accounting</option>
                  <option value="advisory">NR Advisory</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">ประเภทเนื้อหา</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="NEWS">📰 News</option>
                  <option value="INSIGHT">💡 Insight</option>
                  <option value="EVENT">🎟️ Event</option>
                </select>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  กดปุ่ม <strong>เผยแพร่</strong> เพื่อ Publish ทันที หรือ <strong>บันทึก Draft</strong> เพื่อบันทึกแบบซ่อน
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
