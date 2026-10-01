'use client';

import React from 'react';
import { Settings, Server, Database, Key, HardDrive, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const configs = [
    {
      title: 'FastAPI Backend Engine',
      value: 'http://localhost:8000',
      status: 'Active (v1.0.0)',
      icon: Server,
      color: 'text-[#2563EB] bg-blue-50',
    },
    {
      title: 'MongoDB Atlas Database',
      value: 'ProductReviewAnalyzer',
      status: 'Connected (Cluster: nonanda)',
      icon: Database,
      color: 'text-[#05A660] bg-emerald-50',
    },
    {
      title: 'Vector Database Engine',
      value: 'ChromaDB Local Store',
      status: 'Ready (chroma_db/)',
      icon: HardDrive,
      color: 'text-[#FF9900] bg-amber-50',
    },
    {
      title: 'LLM & Embedding Models',
      value: 'Gemini 2.0 Flash + NVIDIA Nemotron 3',
      status: 'API Keys Verified',
      icon: Key,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#2B3674] border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B3674] tracking-tight">
            Engine Settings
          </h1>
          <p className="text-sm font-semibold text-[#A3AED0] mt-1">
            Current AI engine and database configuration for this workspace.
          </p>
        </div>
      </div>

      {/* Health Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configs.map((cfg, idx) => {
          const Icon = cfg.icon;
          return (
            <div key={idx} className="soft-card p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-[#05A660] bg-[#E6FFF0] px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {cfg.status}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider block">
                  {cfg.title}
                </span>
                <span className="text-base font-extrabold text-[#2B3674] mt-1 block">
                  {cfg.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
