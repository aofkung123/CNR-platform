'use client';

import { use, useEffect, useState } from 'react';
import PostEditor from '@/components/admin/PostEditor';

interface Post {
  id: string; title: string; summary: string; content: string;
  category: string; department: string; status: string; thumbnailUrl?: string;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/posts/${id}`)
      .then((r) => r.json())
      .then((data) => { setPost(data); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return <div className="p-8 text-red-500">ไม่พบบทความ</div>;

  return <PostEditor initialData={post} />;
}
