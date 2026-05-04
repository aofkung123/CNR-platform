'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, PlusCircle, Images, Menu, X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/admin',          icon: <LayoutDashboard size={18} />, label: 'Dashboard'   },
    { href: '/admin/posts',    icon: <FileText size={18} />,        label: 'จัดการข่าว' },
    { href: '/admin/posts/new',icon: <PlusCircle size={18} />,      label: 'เพิ่มข่าวใหม่' },
    { href: '/admin/gallery',  icon: <Images size={18} />,          label: 'จัดการรูปภาพ' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-100 p-4 sticky top-0 z-20 shadow-sm">
        <div>
          <h1 className="font-black text-lg text-gray-900">CNR Admin</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen
        w-64 bg-white border-r border-gray-100 flex flex-col py-8 px-4 gap-1 shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="px-4 mb-8 hidden md:block">
          <h1 className="font-black text-xl text-gray-900">CNR Admin</h1>
          <p className="text-xs text-gray-400 mt-1">Content Management System</p>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm
                ${isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }
              `}
            >
              {item.icon} {item.label}
            </Link>
          );
        })}
      </aside>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto w-full max-w-full">
        {children}
      </div>
    </div>
  );
}
