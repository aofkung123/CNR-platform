'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Loader2 } from 'lucide-react';

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // id is the slug
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/v1/posts/slug/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">กำลังโหลดเนื้อหา...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6">
        <h1 className="text-3xl font-bold text-gray-800">ไม่พบบทความนี้</h1>
        <Link
          href="/#news"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={18} /> กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/#news"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>กลับหน้าหลัก</span>
          </Link>
          <div className="h-6 w-px bg-gray-200" />
          <span className="text-sm text-gray-400 truncate">{article.title}</span>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden bg-gray-900">
        {article.thumbnailUrl ? (
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/20 font-black text-6xl">
            CNR GROUP
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase">
                <Tag size={12} /> {article.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/80 text-sm">
                <Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString('th-TH', { 
                  day: 'numeric', month: 'long', year: 'numeric' 
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 overflow-hidden">
          {/* Summary */}
          <div className="text-xl font-medium text-gray-800 leading-relaxed mb-10 border-l-4 border-blue-500 pl-6 bg-blue-50/50 py-4 rounded-r-2xl">
            {article.summary}
          </div>

          {/* Main Content (HTML from TipTap) */}
          <div 
            className="prose prose-lg max-w-none prose-slate prose-headings:text-blue-900 prose-a:text-blue-600"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/#news"
              className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
            >
              <ArrowLeft size={18} /> ดูข่าวทั้งหมด
            </Link>
            
            <div className="text-sm text-gray-400">
              เข้าชมแล้ว {article.viewCount.toLocaleString()} ครั้ง
            </div>
          </div>
        </article>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} CNR GROUP. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
