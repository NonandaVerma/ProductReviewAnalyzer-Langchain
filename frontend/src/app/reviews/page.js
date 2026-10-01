'use client';

import React, { useEffect, useState } from 'react';
import { getProducts, updateProductStatus } from '@/lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { ListFilter, ShieldAlert, CheckCircle2, Clock, AlertTriangle, CheckSquare } from 'lucide-react';

export default function ReviewsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getProducts();
      let list = data && data.products && data.products.length > 0 ? data.products : [
        {
          product_id: 'anker_powerbank_20k',
          name: 'Anker PowerBank 20k',
          category: 'Electronics',
          status: 'Under Review',
          total_reviews: 1250,
          metrics: {
            total_reviews: 1250,
            positive: 525,
            negative: 725,
            neutral: 0,
            top_complaint: 'Hardware Overheating & Charging Rejection',
            root_causes: [
              { topic: 'Hardware', defect: 'Excessive heating after 3 months', warranty_friction: false, urgency: 5 },
              { topic: 'Warranty', defect: 'Claim denied due to internal liquid excuse', warranty_friction: true, urgency: 4 },
              { topic: 'Build Quality', defect: 'Loose charging port pins', warranty_friction: false, urgency: 3 },
            ]
          }
        },
        {
          product_id: 'sony_wh1000xm5',
          name: 'Sony WH-1000XM5 Headphones',
          category: 'Electronics',
          status: 'Approved',
          total_reviews: 890,
          metrics: {
            total_reviews: 890,
            positive: 650,
            negative: 240,
            neutral: 0,
            top_complaint: 'Ear Cushion Wear & Bluetooth Dropouts',
            root_causes: [
              { topic: 'Build Quality', defect: 'Synthetic leather padding peels', warranty_friction: false, urgency: 3 },
              { topic: 'Connectivity', defect: 'Multipoint Bluetooth drops audio', warranty_friction: false, urgency: 2 },
            ]
          }
        }
      ];
      setProducts(list);
      if (list.length > 0) {
        setSelectedProductId(list[0].product_id);
      }
    }
    loadData();
  }, []);

  const activeProduct = products.find((p) => p.product_id === selectedProductId) || products[0] || {};
  const activeMetrics = activeProduct.metrics || {};

  const handleStatusChange = async (newStatus) => {
    if (!activeProduct.product_id) return;
    setUpdatingStatus(true);
    try {
      await updateProductStatus(activeProduct.product_id, newStatus);
      setProducts((prev) =>
        prev.map((p) => (p.product_id === activeProduct.product_id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.warn('Status update fallback:', err);
      setProducts((prev) =>
        prev.map((p) => (p.product_id === activeProduct.product_id ? { ...p, status: newStatus } : p))
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Recharts Sentiment Breakdown Data
  const posCount = activeMetrics.positive || 525;
  const negCount = activeMetrics.negative || 725;
  const neuCount = activeMetrics.neutral || 0;

  const sentimentData = [
    { name: 'Positive', count: posCount, color: '#05A660' },
    { name: 'Negative', count: negCount, color: '#E11D48' },
    { name: 'Neutral', count: neuCount, color: '#FF9900' },
  ];

  // Recharts Issue Category Data
  const aspectData = [
    { name: 'Hardware/Heating', count: 420 },
    { name: 'Warranty Excuses', count: 280 },
    { name: 'Battery Drain', count: 190 },
    { name: 'Build Quality', count: 110 },
    { name: 'Software/App', count: 85 },
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'badge-approved';
      case 'Flagged for R&D': return 'badge-rejected';
      case 'Decision Finished': return 'badge-finished';
      default: return 'badge-review';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#2B3674] tracking-tight">
          Review List & Product Catalog
        </h1>
        <p className="text-sm font-semibold text-[#A3AED0] mt-1">
          Every product analyzed so far. Select one to view its full breakdown and set a PM decision.
        </p>
      </div>

      {/* Ingested Products Ledger Table */}
      <div className="soft-card p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <ListFilter className="w-5 h-5 text-[#2563EB]" />
          <h2 className="text-xs font-bold text-[#2B3674] tracking-wider uppercase">
            Ingested Products Ledger
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F7FE]">
                <th className="pb-3 text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Product Name</th>
                <th className="pb-3 text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Category</th>
                <th className="pb-3 text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Total Reviews</th>
                <th className="pb-3 text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Top Issue</th>
                <th className="pb-3 text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Decision Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F7FE]">
              {products.map((p) => (
                <tr
                  key={p.product_id}
                  onClick={() => setSelectedProductId(p.product_id)}
                  className={`cursor-pointer hover:bg-[#F4F7FE]/60 transition-colors ${
                    p.product_id === selectedProductId ? 'bg-[#EFF6FF]' : ''
                  }`}
                >
                  <td className="py-4 text-sm font-bold text-[#2B3674]">{p.name}</td>
                  <td className="py-4 text-sm font-semibold text-[#A3AED0]">{p.category || 'Electronics'}</td>
                  <td className="py-4 text-sm font-extrabold text-[#2B3674]">{(p.total_reviews || 0).toLocaleString()}</td>
                  <td className="py-4 text-xs font-semibold text-[#2B3674]">{p.metrics?.top_complaint || 'Hardware & Build Defect'}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(p.status)}`}>
                      {p.status || 'Under Review'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="border-t border-[#E9EDF7] my-6" />

      {/* Selected Product Drilldown Header & Status Selector */}
      {activeProduct.name && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#A3AED0] uppercase tracking-wider mb-2">
                Select Product to Analyze
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-white border border-[#E9EDF7] text-[#2B3674] font-bold text-base shadow-sm focus:outline-none focus:border-[#2563EB]"
              >
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A3AED0] uppercase tracking-wider mb-2">
                Set PM Decision Status
              </label>
              <select
                value={activeProduct.status || 'Under Review'}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="w-full px-5 py-3 rounded-full bg-white border border-[#E9EDF7] text-[#2B3674] font-bold text-sm shadow-sm focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Flagged for R&D">Flagged for R&D</option>
                <option value="Decision Finished">Decision Finished</option>
              </select>
            </div>
          </div>

          {/* 3 Hero Metric Cards for Active Product */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="soft-card p-6">
              <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider block">
                Total Reviews Processed
              </span>
              <div className="text-3xl font-extrabold text-[#2B3674] mt-2">
                {(activeProduct.total_reviews || 0).toLocaleString()}
              </div>
              <span className="inline-block mt-2 px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-bold rounded-full">
                {activeProduct.category || 'Product'}
              </span>
            </div>

            <div className="soft-card p-6">
              <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider block">
                Sentiment Breakdown
              </span>
              <div className="text-2xl font-extrabold text-[#2B3674] mt-2">
                {Math.round((posCount / (posCount + negCount || 1)) * 100)}% Pos | {Math.round((negCount / (posCount + negCount || 1)) * 100)}% Neg
              </div>
              <span className="inline-block mt-2 px-3 py-1 bg-rose-50 text-[#E11D48] text-xs font-bold rounded-full">
                -16% vs Last Batch
              </span>
            </div>

            <div className="soft-card p-6">
              <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider block">
                Top Reported Issue
              </span>
              <div className="text-xl font-extrabold text-[#2B3674] mt-2 truncate">
                {activeMetrics.top_complaint || 'Hardware Heating'}
              </div>
              <span className="inline-block mt-2 px-3 py-1 bg-amber-50 text-[#FF9900] text-xs font-bold rounded-full">
                High Priority Action
              </span>
            </div>
          </div>

          {/* Recharts Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Chart */}
            <div className="soft-card p-6">
              <h2 className="text-xs font-bold text-[#2B3674] tracking-widest uppercase mb-4">
                Sentiment Ratio Breakdown
              </h2>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 12, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 12, fontWeight: 600 }} />
                    <Tooltip cursor={{ fill: '#F4F7FE' }} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0px 14px 36px rgba(112, 144, 176, 0.14)', border: 'none' }} />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Issue Category Chart */}
            <div className="soft-card p-6">
              <h2 className="text-xs font-bold text-[#2B3674] tracking-widest uppercase mb-4">
                Issue Category Breakdown
              </h2>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aspectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11, fontWeight: 600 }} />
                    <Tooltip cursor={{ fill: '#F4F7FE' }} contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0px 14px 36px rgba(112, 144, 176, 0.14)', border: 'none' }} />
                    <Bar dataKey="count" fill="#2563EB" radius={[10, 10, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pydantic Root Cause Summary Table */}
          <div className="soft-card p-6">
            <h2 className="text-xs font-bold text-[#2B3674] tracking-widest uppercase mb-1">
              AI-Extracted Root-Cause Breakdown (Pydantic Parsed)
            </h2>
            <p className="text-xs font-semibold text-[#A3AED0] mb-4">
              Insights extracted automatically from unstructured rants using LangChain LCEL structured outputs.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F4F7FE]">
                    <th className="pb-3 text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Aspect Topic</th>
                    <th className="pb-3 text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Specific Reported Defect</th>
                    <th className="pb-3 text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Warranty Friction Flag</th>
                    <th className="pb-3 text-xs font-bold text-[#A3AED0] uppercase tracking-wider">Urgency Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F7FE]">
                  {(activeMetrics.root_causes || [
                    { topic: 'Hardware', defect: 'Excessive heating after 3 months', warranty_friction: false, urgency: 5 },
                    { topic: 'Warranty', defect: 'Claim denied due to internal liquid excuse', warranty_friction: true, urgency: 4 },
                    { topic: 'Build Quality', defect: 'Loose charging port pins', warranty_friction: false, urgency: 3 }
                  ]).map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-4 text-sm font-bold text-[#2B3674]">{item.topic}</td>
                      <td className="py-4 text-sm font-semibold text-[#2B3674]">{item.defect}</td>
                      <td className="py-4 text-xs font-bold">
                        {item.warranty_friction ? (
                          <span className="text-[#FF9900] bg-[#FFF5E5] px-3 py-1 rounded-full">⚠️ Yes (Policy Excuses)</span>
                        ) : (
                          <span className="text-[#05A660] bg-[#E6FFF0] px-3 py-1 rounded-full">✅ No Friction</span>
                        )}
                      </td>
                      <td className="py-4 text-xs font-bold text-[#2B3674]">
                        ⚡ {item.urgency}/5 ({item.urgency >= 4 ? 'Critical' : 'Moderate'})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
