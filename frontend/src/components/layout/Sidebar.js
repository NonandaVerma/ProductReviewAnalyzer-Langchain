'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UploadCloud, 
  ListFilter, 
  MessageSquareCode, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navGroups = [
    {
      name: 'OVERVIEW',
      items: [
        { title: 'Dashboard', href: '/', icon: LayoutDashboard },
      ],
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
      items: [
        { title: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-[72px] left-0 bottom-0 bg-white border-r-0 shadow-[0px_18px_40px_rgba(112,144,176,0.08)] z-40 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand Lockup */}
      <div className="p-4 border-b border-[#E9EDF7] flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <img 
              src="/pmLogo.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
            />
            <div>
              <div className="text-xs font-extrabold text-[#2B3674]">ProductReviewAnalyzer</div>
              <div className="text-[9px] font-bold text-[#2563EB] uppercase tracking-wider">PM Intelligence</div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <img 
              src="/pmLogo.png" 
              alt="Logo" 
              className="w-7 h-7 object-contain"
            />
          </div>
        )}
      </div>

      {/* Collapse / Expand Toggle Button */}
      <div className="p-3 border-b border-[#E9EDF7] flex justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#F4F7FE] text-[#2B3674] hover:bg-[#2563EB] hover:text-white rounded-xl font-bold text-xs shadow-sm transition-all"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Nav Menu Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            {!collapsed && (
              <h3 className="text-[11px] font-extrabold text-[#A3AED0] tracking-wider uppercase px-3">
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
    </aside>
  );
}
