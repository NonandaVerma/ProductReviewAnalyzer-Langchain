'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#2563EB] shadow-sm z-50 flex items-center justify-between px-4 sm:px-6 transition-all">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors flex-shrink-0"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <img
            src="/pmLogo.png"
            alt="ProductReviewAnalyzer Logo"
            className="w-9 h-9 object-contain flex-shrink-0"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-extrabold text-white tracking-tight leading-none">
              ProductReviewAnalyzer
            </span>
            <span className="text-[10px] font-bold text-blue-200 tracking-wider uppercase mt-1">
              PM Decision Intelligence Suite
            </span>
          </div>
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center font-bold text-sm transition-colors"
              title={user.name}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-60 bg-white rounded-xl shadow-[0px_14px_36px_rgba(112,144,176,0.25)] border border-[#E9EDF7] p-4 z-50">
                <div className="text-sm font-bold text-[#2B3674] truncate">{user.name}</div>
                <div className="text-xs font-medium text-[#A3AED0] truncate mt-0.5">{user.email}</div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="w-9 h-9 rounded-full bg-white text-[#2563EB] hover:bg-blue-50 flex items-center justify-center transition-colors shadow-sm flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
