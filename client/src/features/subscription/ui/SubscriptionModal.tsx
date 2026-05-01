'use client';
// src/features/subscription/ui/SubscriptionModal.tsx

import { useState } from 'react';
import { subscriptionApi } from '@/src/shared/api/subscriptionApi';
import {
  X,
  Crown,
  Check,
  Loader2,
  ExternalLink,
  Layers,
  FileSpreadsheet,
  LayoutGrid,
  Database,
  History as HistoryIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const FEATURES: { icon: LucideIcon; text: string }[] = [
  { icon: Layers, text: 'Неограниченное кол-во таблиц' },
  { icon: Database, text: 'Неограниченное кол-во записей' },
  { icon: LayoutGrid, text: 'Все типы полей' },
  { icon: FileSpreadsheet, text: 'Экспорт в Excel' },
  { icon: HistoryIcon, text: 'История изменений' },
];

export function SubscriptionModal({ onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      const { paymentUrl } = await subscriptionApi.initPayment();
      window.location.href = paymentUrl;
    } catch {
      setError('Не удалось создать счёт. Попробуйте позже.');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,15,20,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: '#fff', border: '1px solid rgba(13,15,20,0.08)' }}
      >
        {/* Gradient header */}
        <div
          className="px-7 pt-8 pb-7"
          style={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #ff4500 100%)',
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
          >
            <X size={16} />
          </button>

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <Crown size={28} className="text-white" fill="rgba(255,255,255,0.9)" />
          </div>

          <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
            StockFlow PRO
          </h2>
          <p className="text-white/70 text-sm">
            Разблокируйте все возможности платформы
          </p>

          {/* Price */}
          <div className="mt-5 flex items-end gap-2">
            <span className="text-4xl font-black text-white leading-none">990+ ₽</span>
            <span className="text-white/60 text-sm mb-1">/ месяц</span>
          </div>
        </div>

        {/* Features */}
        <div className="px-7 py-6">
          <p className="text-xs font-semibold text-[#0D0F14]/40 uppercase tracking-widest mb-4">
            Что входит в PRO
          </p>
          <ul className="space-y-3 mb-6">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,107,53,0.1)' }}
                >
                  <Icon size={14} className="text-[#FF6B35]" />
                </div>
                <span className="text-sm font-medium text-[#0D0F14]">{text}</span>
                <Check size={14} className="text-emerald-500 ml-auto shrink-0" />
              </li>
            ))}
          </ul>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-xs text-red-600"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #FF6B35 0%, #ff4500 100%)',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(255,107,53,0.35)',
            }}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Переход к оплате…</>
            ) : (
              <><ExternalLink size={16} /> Оплатить через Robokassa</>
            )}
          </button>

          <p className="text-center text-[11px] text-[#0D0F14]/30 mt-3">
            Безопасная оплата — Robokassa. Отмена в любое время.
          </p>
        </div>
      </div>
    </div>
  );
}