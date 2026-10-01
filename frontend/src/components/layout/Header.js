'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-[#E9EDF7] shadow-sm z-50 flex items-center px-6 transition-all">
      <Link href="/" className="flex items-center gap-3.5 group">
        <div className="w-11 h-11 bg-[#F4F7FE] rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-[#E9EDF7] group-hover:scale-105 transition-transform">
          <img 
            src="/pmLogo.png" 
            alt="ProductReviewAnalyzer Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-extrabold text-[#2B3674] tracking-tight leading-none group-hover:text-[#2563EB] transition-colors">
            ProductReviewAnalyzer
          </span>
          <span className="text-[10px] font-bold text-[#2563EB] tracking-wider uppercase mt-1">
            PM Decision Intelligence Suite
          </span>
        </div>
      </Link>
    </header>
  );
}
