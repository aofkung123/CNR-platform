'use client';

import { useEffect, useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import type { BrandConfig } from '@/config/brands';

interface Document {
  id: string;
  filename: string;
  category: string;
  year: number;
  month?: number;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

interface DocumentsSectionProps {
  brand: BrandConfig;
  category: string;
}

export function DocumentsSection({ brand, category }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams({ brand: brand.key, category });
    if (year) params.set('year', year);

    fetch(`/api/documents?${params}`)
      .then((r) => r.json())
      .then((data) => setDocuments(data.documents ?? []))
      .finally(() => setLoading(false));
  }, [brand.key, category, year]);

  const handleDownload = async (doc: Document) => {
    const res = await fetch(`/api/documents/${doc.id}/download`);
    const { url } = await res.json();
    window.open(url, '_blank');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

  return (
    <section id="documents" className="cnr-section">
      <div className="cnr-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="section-eyebrow">DOCUMENTS</p>
            <h2 className="section-title">เอกสารและรายงาน</h2>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--muted-foreground)]" />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="form-input py-2 w-auto"
            >
              <option value="">ทุกปี</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-[var(--section-bg)] animate-pulse" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted-foreground)]">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p>ไม่พบเอกสารในขณะนี้</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="cnr-card flex items-center gap-4 p-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--foreground)] truncate">{doc.filename}</p>
                  <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                    <Calendar size={10} />
                    {doc.year}{doc.month ? `/${String(doc.month).padStart(2, '0')}` : ''} · {formatSize(doc.fileSize)}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex-shrink-0 p-2 rounded-lg transition-colors hover:bg-[var(--section-bg)]"
                  style={{ color: 'var(--brand-primary)' }}
                  title="ดาวน์โหลด"
                >
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
