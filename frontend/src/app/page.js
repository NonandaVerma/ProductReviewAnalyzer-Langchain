'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { ArrowUpRight, CheckCircle2, Clock, AlertTriangle, CheckSquare, Layers } from 'lucide-react';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getProducts();
      if (data && data.products) {
        setProducts(data.products);
      } else {
        // Fallback demo dataset if API isn't populated yet
        setProducts([
          {
            product_id: 'anker_powerbank_20k',
            name: 'Anker PowerBank 20k',
            category: 'Electronics',
            status: 'Under Review',
            total_reviews: 1250,
          },
          {
            product_id: 'sony_wh1000xm5',
            name: 'Sony WH-1000XM5 Headphones',
            category: 'Electronics',
            status: 'Approved',
            total_reviews: 890,
          },
          {
            product_id: 'ergonomic_desk_chair',
            name: 'Ergonomic Mesh Desk Chair',
            category: 'Home & Furniture',
            status: 'Flagged for R&D',
            total_reviews: 370,
          },
        ]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const totalProducts = products.length;
  const totalReviews = products.reduce((acc, p) => acc + (p.total_reviews || 0), 0);

  const statusCounts = {
    'Under Review': 0,
    'Approved': 0,
    'Flagged for R&D': 0,
    'Decision Finished': 0,
  };

  products.forEach((p) => {
    const st = p.status || 'Under Review';
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  });

  const chartData = [
    { name: 'Under Review', count: statusCounts['Under Review'], color: '#FF9900' },
    { name: 'Approved', count: statusCounts['Approved'], color: '#05A660' },
    { name: 'Flagged for R&D', count: statusCounts['Flagged for R&D'], color: '#E11D48' },
    { name: 'Decision Finished', count: statusCounts['Decision Finished'], color: '#2563EB' },
  ];

  const metricCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      subtitle: `${totalReviews.toLocaleString()} reviews`,
      icon: Layers,
      iconBg: 'bg-blue-50 text-[#2563EB]',
    },
    {
      title: 'Under Review',
      value: statusCounts['Under Review'],
      subtitle: 'Pending decision',
      icon: Clock,
      iconBg: 'bg-amber-50 text-[#FF9900]',
    },
    {
      title: 'Approved',
      value: statusCounts['Approved'],
      subtitle: 'Cleared for action',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-[#05A660]',
    },
    {
      title: 'Flagged for R&D',
      value: statusCounts['Flagged for R&D'],
      subtitle: 'Needs attention',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 text-[#E11D48]',
    },
    {
      title: 'Finished',
      value: statusCounts['Decision Finished'],
      subtitle: 'Closed out',
      icon: CheckSquare,
      iconBg: 'bg-[#EFF6FF] text-[#2563EB]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#2B3674] tracking-tight">
          Portfolio Overview
        </h1>
        <p className="text-sm font-semibold text-[#A3AED0] mt-1">
          A bird's-eye view of every product analyzed in your workspace.
        </p>
      </div>

      {/* 5 Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="soft-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#A3AED0] tracking-wider uppercase">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-[#2B3674] tracking-tight">
                  {card.value}
                </div>
                <span className="inline-block mt-2 px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-bold rounded-full">
                  ↑ {card.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="soft-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold text-[#2B3674] tracking-widest uppercase">
            Products by Decision Status
          </h2>
          <span className="text-xs font-semibold text-[#A3AED0]">Live Mongo Ledger</span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#A3AED0', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#A3AED0', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip 
                cursor={{ fill: '#F4F7FE' }}
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: '12px', 
                  boxShadow: '0px 14px 36px rgba(112, 144, 176, 0.14)',
                  border: 'none',
                  color: '#2B3674',
                  fontWeight: '700'
                }}
              />
              <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={48}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Navigation Quick Link Footer Banner */}
      <div className="flex items-center justify-between text-xs font-semibold text-[#A3AED0]">
        <span>
          Open <Link href="/reviews" className="text-[#2563EB] underline hover:font-bold">Review List</Link> to drill into any product's analysis, or <Link href="/assistant" className="text-[#2563EB] underline hover:font-bold">Assistant</Link> to ask questions about one.
        </span>
        <Link href="/reviews" className="flex items-center gap-1 text-[#2563EB] font-bold hover:underline">
          View Catalog <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
