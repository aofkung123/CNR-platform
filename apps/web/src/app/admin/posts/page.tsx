'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight,
  Eye, FileText,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

// ─── Types ────────────────────────────────────────────────────
interface Post {
  id:          string;
  title:       string;
  slug:        string;
  department:  string;
  category:    string;
  status:      'DRAFT' | 'PUBLISHED';
  viewCount:   number;
  publishedAt: string | null;
  createdAt:   string;
}

const DEPT_LABELS: Record<string, string> = {
  audit: 'CAC Audit', accounting: 'NR Accounting', advisory: 'NR Advisory',
};

const DEPT_COLORS: Record<string, string> = {
  audit: 'bg-blue-100 text-blue-700',
  accounting: 'bg-green-100 text-green-700',
  advisory: 'bg-amber-100 text-amber-700',
};

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT:     'bg-gray-100 text-gray-600',
};

// ─── Main Page ────────────────────────────────────────────────
export default function AdminPostsPage() {
  const [posts,      setPosts]      = useState<Post[]>([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [department, setDepartment] = useState('');
  const [status,     setStatus]     = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const limit = 15;
  const totalPages = Math.ceil(total / limit);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(department ? { department } : {}),
      ...(status     ? { status }     : {}),
    });
    const res  = await fetch(`/api/v1/posts?${params}`);
    const data = await res.json();
    setPosts(data.posts ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, department, status]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบบทความนี้?')) return;
    setDeletingId(id);
    await fetch(`/api/v1/posts/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    load();
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText size={24} className="text-blue-600" /> จัดการข่าวสาร
              </h2>
              <p className="text-gray-500 text-sm mt-1">ทั้งหมด {total} บทความ</p>
            </div>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus size={18} /> เพิ่มข่าวใหม่
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อบทความ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">ทุกแผนก</option>
              <option value="audit">CAC Audit</option>
              <option value="accounting">NR Accounting</option>
              <option value="advisory">NR Advisory</option>
            </select>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">ทุกสถานะ</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['หัวข้อ', 'แผนก', 'ประเภท', 'สถานะ', 'วิว', 'วันที่', 'จัดการ'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      ไม่พบบทความ
                    </td>
                  </tr>
                ) : (
                  filtered.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 max-w-[280px]">
                        <p className="font-semibold text-gray-800 line-clamp-2">{post.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">/news/{post.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${DEPT_COLORS[post.department] ?? 'bg-gray-100 text-gray-600'}`}>
                          {DEPT_LABELS[post.department] ?? post.department}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{post.category}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${STATUS_STYLES[post.status]}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Eye size={12} /> {post.viewCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('th-TH')
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500">
                  แสดง {(page - 1) * limit + 1}–{Math.min(page * limit, total)} จาก {total} รายการ
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 py-1 text-sm font-medium text-gray-700">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
    </AdminLayout>
  );
}
