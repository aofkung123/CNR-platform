'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  AlertTriangle, CheckCircle2, Clock, Download,
  Filter, MessageSquareWarning, RefreshCcw, Search, Mail
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

const CATEGORY_COLORS: Record<string, string> = {
  technical:  'bg-red-100 text-red-700',
  usage:      'bg-orange-100 text-orange-700',
  suggestion: 'bg-blue-100 text-blue-700',
  billing:    'bg-purple-100 text-purple-700',
  other:      'bg-gray-100 text-gray-700',
};

const BRAND_LABELS: Record<string, string> = {
  cnr_group:    'CNR Group',
  cac_audit:    'CAC Audit',
  nr_accounting:'NR Accounting',
  nr_advisory:  'NR Advisory',
  model_mix:    'Model Mix',
};

export default function AdminReportsPage() {
  const router = useRouter();
  const [reports, setReports]     = useState<Report[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [filterBrand, setFilterBrand]       = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterRead, setFilterRead]         = useState('');
  const [search, setSearch]                 = useState('');
  const [page, setPage]                     = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterBrand)    params.set('brand',    filterBrand);
      if (filterCategory) params.set('category', filterCategory);
      if (filterRead)     params.set('isRead',   filterRead);
      params.set('page',  String(page));
      params.set('limit', '20');
      const res = await fetch(`/api/v1/reports?${params}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setReports(data.reports ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }, [filterBrand, filterCategory, filterRead, page]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await fetch(`/api/v1/reports/${id}/read`, { method: 'PATCH' });
    setReports(prev => prev.map(r => r.id === id ? { ...r, isRead: true } : r));
  };

  const filtered = reports.filter(r =>
    !search || r.name.includes(search) || r.email.includes(search) || r.message.includes(search)
  );
  const unread = reports.filter(r => !r.isRead).length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquareWarning className="text-orange-500" size={26} />
              รายงานปัญหา / ข้อเสนอแนะ
            </h2>
            <p className="text-gray-500 mt-1">
              ทั้งหมด {total} รายการ
              {unread > 0 && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">{unread} ยังไม่อ่าน</span>}
            </p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
            <RefreshCcw size={16} /> รีเฟรช
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
          <Filter size={16} className="text-gray-400" />
          <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="">ทุกประเภท</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={filterRead} onChange={e => { setFilterRead(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="">ทุกสถานะ</option>
            <option value="false">ยังไม่อ่าน</option>
            <option value="true">อ่านแล้ว</option>
          </select>
          <div className="flex items-center gap-2 ml-auto border border-gray-200 rounded-lg px-3 py-1.5">
            <Search size={14} className="text-gray-400" />
            <input type="text" placeholder="ค้นหาชื่อ / อีเมล..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-sm outline-none w-40" />
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>}

        <div className="space-y-3">
          {loading ? (
            [...Array(5)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />)
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <MessageSquareWarning size={48} className="mx-auto mb-3 opacity-30" />
              <p>ไม่พบข้อมูล</p>
            </div>
          ) : filtered.map(r => (
            <div
              key={r.id}
              onClick={() => {
                if (!r.isRead) markRead(r.id);
                router.push(`/admin/reports/${r.id}`);
              }}
              className={`bg-white rounded-3xl p-6 shadow-sm border cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${!r.isRead ? 'border-l-8 border-l-orange-400' : 'border-gray-100'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-bold text-xl text-gray-900">{r.name}</span>
                    {!r.isRead && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase">NEW</span>}
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${CATEGORY_COLORS[r.category] ?? 'bg-gray-100 text-gray-700'}`}>
                      {CATEGORY_LABELS[r.category] ?? r.category}
                    </span>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{BRAND_LABELS[r.brand] ?? r.brand}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-1 italic text-sm">{r.message}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5"><Clock size={14} />{new Date(r.createdAt).toLocaleString('th-TH')}</span>
                    <span className="flex items-center gap-1.5"><Mail size={14} />{r.email}</span>
                    {r.attachments && JSON.parse(r.attachments).length > 0 && (
                      <span className="flex items-center gap-1.5 text-blue-500 bg-blue-50 px-2 py-1 rounded-lg"><Download size={14} />{JSON.parse(r.attachments).length} ไฟล์แนบ</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {r.isRead
                    ? <div className="p-2 bg-green-50 text-green-500 rounded-full"><CheckCircle2 size={20} /></div>
                    : <div className="p-2 bg-orange-50 text-orange-500 rounded-full"><AlertTriangle size={20} /></div>
                  }
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest group-hover:underline">คลิกเพื่อดูรายละเอียด ›</span>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {total > 20 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <button disabled={page === 1} onClick={(e) => { e.stopPropagation(); setPage(p => p - 1); }}
                className="px-6 py-2 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm">← ก่อนหน้า</button>
              <span className="font-bold text-gray-500">หน้า {page} / {Math.ceil(total / 20)}</span>
              <button disabled={page * 20 >= total} onClick={(e) => { e.stopPropagation(); setPage(p => p + 1); }}
                className="px-6 py-2 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm">ถัดไป →</button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
