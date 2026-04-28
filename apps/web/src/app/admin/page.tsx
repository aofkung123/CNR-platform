'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  LayoutDashboard, FileText, PlusCircle, Eye, TrendingUp,
  ChevronRight, Users, BarChart2, Images,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────
interface DeptActivity { department: string; totalViews: number; totalPosts: number; }
interface TrendingPost { id: string; title: string; department: string; category: string; viewCount: number; publishedAt: string; }
interface StatusCount  { status: string; count: number; }
interface MonthlyCount { month: string; count: number; }
interface Stats {
  departmentActivity: DeptActivity[];
  topTrending:        TrendingPost[];
  statusSummary:      StatusCount[];
  monthlyPublished:   MonthlyCount[];
}

const DEPT_COLORS: Record<string, string> = {
  audit:      '#1E5FA8',
  accounting: '#16a34a',
  advisory:   '#d97706',
};

const STATUS_COLORS = ['#6366f1', '#22c55e'];

const DEPT_LABELS: Record<string, string> = {
  audit:      'CAC Audit',
  accounting: 'NR Accounting',
  advisory:   'NR Advisory',
};

// ─── API Helper ───────────────────────────────────────────────
async function fetchStats(): Promise<Stats> {
  const res = await fetch('/api/v1/stats/news-summary');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
      <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${color}20` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStats();
      setStats(data);
    } catch {
      setError('ไม่สามารถโหลดข้อมูลสถิติได้');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalViews = stats?.departmentActivity.reduce((s, d) => s + d.totalViews, 0) ?? 0;
  const totalPosts = stats?.statusSummary.reduce((s, d) => s + d.count, 0) ?? 0;
  const published  = stats?.statusSummary.find((s) => s.status === 'PUBLISHED')?.count ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-8 px-4 gap-1 shrink-0">
        <div className="px-4 mb-8">
          <h1 className="font-black text-xl text-gray-900">CNR Admin</h1>
          <p className="text-xs text-gray-400 mt-1">News Management System</p>
        </div>
        {[
          { href: '/admin',          icon: <LayoutDashboard size={18} />, label: 'Dashboard'   },
          { href: '/admin/posts',    icon: <FileText size={18} />,        label: 'จัดการข่าว' },
          { href: '/admin/posts/new',icon: <PlusCircle size={18} />,      label: 'เพิ่มข่าวใหม่' },
          { href: '/admin/gallery',  icon: <Images size={18} />,          label: 'จัดการรูปภาพ' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium text-sm"
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-500 mt-1">ภาพรวมระบบข่าวสาร CNR GROUP</p>
            </div>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md"
            >
              <PlusCircle size={18} /> เพิ่มข่าวใหม่
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<FileText size={22} />}   label="บทความทั้งหมด" value={totalPosts}  color="#6366f1" />
                <StatCard icon={<Eye size={22} />}         label="ยอดวิวรวม"     value={totalViews.toLocaleString()} color="#3b82f6" />
                <StatCard icon={<TrendingUp size={22} />}  label="เผยแพร่แล้ว"  value={published}  color="#22c55e" sub={`จาก ${totalPosts} บทความ`} />
                <StatCard icon={<BarChart2 size={22} />}   label="Departments"  value="3"           color="#f59e0b" />
              </div>

              {/* Charts Row 1 */}
              <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* Monthly Published */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart2 size={18} className="text-blue-600" /> ยอด Publish รายเดือน
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats?.monthlyPublished ?? []}>
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="จำนวน" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Pie */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-purple-600" /> สถานะ Content
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={stats?.statusSummary ?? []}
                        dataKey="count"
                        nameKey="status"
                        cx="50%" cy="50%"
                        outerRadius={75}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {stats?.statusSummary.map((_, i) => (
                          <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Department Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Eye size={18} className="text-green-600" /> ยอดวิวแยกตามแผนก
                  </h3>
                  <div className="space-y-4">
                    {(stats?.departmentActivity ?? []).map((d) => {
                      const pct = totalViews > 0 ? Math.round((d.totalViews / totalViews) * 100) : 0;
                      return (
                        <div key={d.department}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{DEPT_LABELS[d.department] ?? d.department}</span>
                            <span className="text-gray-500">{d.totalViews.toLocaleString()} views · {d.totalPosts} posts</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: DEPT_COLORS[d.department] ?? '#6b7280' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top 5 Trending */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-orange-500" /> Top 5 Trending
                  </h3>
                  <ol className="space-y-3">
                    {(stats?.topTrending ?? []).map((post, i) => (
                      <li key={post.id} className="flex items-start gap-3">
                        <span className="text-2xl font-black text-gray-200 w-8 shrink-0 leading-none">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="text-sm font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 transition-colors"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{DEPT_LABELS[post.department] ?? post.department}</span>
                            <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5">
                              <Eye size={11} /> {post.viewCount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 shrink-0 mt-1" />
                      </li>
                    ))}
                    {(stats?.topTrending ?? []).length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">ยังไม่มีข้อมูล</p>
                    )}
                  </ol>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
