'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  ChevronLeft, Clock, Phone, Mail, Tag, Building2,
  FileText, Download, CheckCircle2, AlertTriangle, ExternalLink
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  attachments: string | null;
  brand: string;
  isRead: boolean;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  technical:  'ปัญหาเทคนิค',
  usage:      'ปัญหาการใช้งาน',
  suggestion: 'ข้อเสนอแนะ',
  billing:    'ปัญหาด้านการเงิน',
  other:      'อื่นๆ',
};

const BRAND_LABELS: Record<string, string> = {
  cnr_group:    'CNR Group',
  cac_audit:    'CAC Audit',
  nr_accounting:'NR Accounting',
  nr_advisory:  'NR Advisory',
  model_mix:    'Model Mix',
};

function filenameFromKey(key: string): string {
  return key.split('/').pop() ?? key;
}

function isImage(key: string): boolean {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(key);
}

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport]       = useState<Report | null>(null);
  const [urls, setUrls]           = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(true);
  const [urlsLoading, setUrlsLoading] = useState(false);

  const loadReport = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/reports`);
      const data = await res.json();
      const found = data.reports?.find((r: Report) => r.id === id);
      if (found) {
        setReport(found);
        if (!found.isRead) {
          fetch(`/api/v1/reports/${id}/read`, { method: 'PATCH' });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadReport(); }, [loadReport]);

  // Fetch pre-signed URLs once we have the report's attachment keys
  useEffect(() => {
    if (!report?.attachments) return;

    const keys: string[] = JSON.parse(report.attachments);
    if (keys.length === 0) return;

    setUrlsLoading(true);
    fetch(`/api/v1/reports/attachments?keys=${encodeURIComponent(JSON.stringify(keys))}`)
      .then((r) => r.json())
      .then((data) => {
        setUrls(data);
      })
      .catch((err) => console.error('[Attachments] Failed to fetch URLs:', err))
      .finally(() => setUrlsLoading(false));
  }, [report?.attachments]);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </AdminLayout>
  );

  if (!report) return (
    <AdminLayout>
      <div className="text-center py-20">
        <p className="text-gray-500">ไม่พบข้อมูลรายงาน</p>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 flex items-center gap-2 mx-auto">
          <ChevronLeft size={18} /> กลับไปหน้าหลัก
        </button>
      </div>
    </AdminLayout>
  );

  const attachmentKeys: string[] = report.attachments ? JSON.parse(report.attachments) : [];

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Top Nav */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-gray-50">
            <ChevronLeft size={20} />
          </div>
          <span className="font-medium">กลับไปหน้ารายงาน</span>
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-50 bg-gray-50/50">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-gray-900">{report.name}</h1>
                  {report.isRead ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> อ่านแล้ว
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                      <AlertTriangle size={12} /> มาใหม่
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(report.createdAt).toLocaleString('th-TH')}</span>
                  <span className="flex items-center gap-1.5"><Tag size={16} /> {CATEGORY_LABELS[report.category] || report.category}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Contact Info Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                  <Phone size={14} /> เบอร์โทรศัพท์
                </p>
                <p className="font-bold text-gray-900">{report.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail size={14} /> อีเมล
                </p>
                <a href={`mailto:${report.email}`} className="font-bold text-blue-600 hover:underline break-all">{report.email}</a>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 size={14} /> แบรนด์
                </p>
                <p className="font-bold text-gray-900">{BRAND_LABELS[report.brand] || report.brand}</p>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-4 flex items-center gap-1.5">
                <FileText size={14} /> รายละเอียดปัญหา / ข้อเสนอแนะ
              </p>
              <div className="bg-white border border-gray-100 rounded-3xl p-6 text-gray-700 leading-relaxed text-lg whitespace-pre-wrap break-words shadow-inner min-h-[200px]">
                {report.message}
              </div>
            </div>

            {/* Attachments Section */}
            {attachmentKeys.length > 0 && (
              <div className="space-y-6">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Download size={14} /> ไฟล์แนบ ({attachmentKeys.length} ไฟล์)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attachmentKeys.map((key, i) => {
                    const fileUrl = urls[key] ?? '';
                    const name    = filenameFromKey(key);

                    return (
                      <div key={key} className="group relative bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                        {isImage(key) ? (
                          <div className="relative aspect-video bg-gray-100">
                            {urlsLoading ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400" />
                              </div>
                            ) : fileUrl ? (
                              <img
                                src={fileUrl}
                                alt={`Attachment ${i + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                                <ExternalLink size={32} />
                                <span className="text-xs mt-1">ไม่สามารถโหลดรูป</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          </div>
                        ) : (
                          <div className="aspect-video flex flex-col items-center justify-center text-gray-400">
                            <FileText size={48} className="mb-2 opacity-20" />
                            <span className="text-xs px-3 text-center">{name}</span>
                          </div>
                        )}
                        <div className="p-3 flex items-center justify-between bg-white/80 backdrop-blur-md absolute bottom-0 inset-x-0 border-t border-gray-100">
                          <span className="text-xs font-medium text-gray-600 truncate max-w-[150px]">{name}</span>
                          <div className="flex gap-2">
                            {fileUrl ? (
                              <>
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                  title="ดูไฟล์จริง"
                                >
                                  <ExternalLink size={14} />
                                </a>
                                <a
                                  href={fileUrl}
                                  download={name}
                                  className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                  title="ดาวน์โหลด"
                                >
                                  <Download size={14} />
                                </a>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400 px-2 py-1">กำลังโหลด...</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
