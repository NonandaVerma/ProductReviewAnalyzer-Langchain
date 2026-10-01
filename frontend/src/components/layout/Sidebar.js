'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UploadCloud,
  ListFilter,
  MessageSquareCode,
  Settings,
  X,
} from 'lucide-react';

const navGroups = [
  {
    name: 'OVERVIEW',
    items: [{ title: 'Dashboard', href: '/', icon: LayoutDashboard }],
  },
  {
    name: 'WORKFLOW',
    items: [
      { title: 'Upload', href: '/upload', icon: UploadCloud },
      { title: 'Review List', href: '/reviews', icon: ListFilter },
      { title: 'Assistant', href: '/assistant', icon: MessageSquareCode },
    ],
  },
  {
    name: 'SYSTEM',
    items: [{ title: 'Settings', href: '/settings', icon: Settings }],
  },
];

function NavContent({ collapsed, pathname, onNavigate }) {
  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {navGroups.map((group, idx) => (
        <div key={idx} className="space-y-2">
          {!collapsed && (
            <h3 className="text-[11px] font-medium text-[#A3AED0] tracking-wider uppercase px-3">
              {group.name}
            </h3>
          )}
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/25'
                      : 'text-[#2B3674] hover:bg-[#F4F7FE] hover:translate-x-1'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed top-[72px] left-0 bottom-0 bg-white shadow-[0px_18px_40px_rgba(112,144,176,0.08)] z-40 transition-all duration-300 flex-col ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <NavContent collapsed={collapsed} pathname={pathname} />
      </aside>

      {/* Mobile off-canvas drawer — always mounted so the transform/opacity transitions
          actually animate; toggling via conditional render would pop it in/out instantly. */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
        <aside
          className={`absolute top-0 left-0 bottom-0 w-72 bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-[72px] flex items-center justify-between px-4 border-b border-[#E9EDF7] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <img src="/pmLogo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-sm font-semibold text-[#2B3674]">ProductReviewAnalyzer</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F4F7FE] text-[#2B3674]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <NavContent collapsed={false} pathname={pathname} onNavigate={onCloseMobile} />
        </aside>
      </div>
    </>
  );
}
