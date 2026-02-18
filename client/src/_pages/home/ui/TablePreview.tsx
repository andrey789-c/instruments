"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const rows = [
  { name: "Наушники Sony WH-1000", sku: "SON-001", qty: 24, status: "В наличии" },
  { name: "Кабель USB-C 1м",       sku: "CBL-047", qty: 7,  status: "Мало"      },
  { name: "Чехол iPhone 15 Pro",   sku: "CSE-112", qty: 0,  status: "Нет"       },
  { name: "Зарядка 65W GaN",       sku: "CHG-033", qty: 51, status: "В наличии" },
  { name: "Стекло защитное",       sku: "GLS-009", qty: 3,  status: "Мало"      },
];

const statusStyle = {
  "В наличии": "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  "Мало":      "bg-yellow-400/10  text-yellow-400  border-yellow-400/20",
  "Нет":       "bg-red-400/10     text-red-400     border-red-400/20",
};

export function TablePreview() {
  const [hi, setHi] = useState<number | null>(null);
  useEffect(() => {
    const t = setInterval(() => setHi(Math.floor(Math.random() * rows.length)), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 sm:border-white/10 bg-[#0f1117] shadow-[0_20px_60px_rgba(0,0,0,0.8)] sm:shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
      {/* chrome */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 sm:border-white/[0.08] bg-white/[0.06] sm:bg-white/[0.04]">
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400" />
        <span className="ml-2 sm:ml-4 text-[10px] sm:text-[11px] text-white/40 sm:text-white/30 font-mono truncate">📦 Склад — Электроника</span>
      </div>

      {/* toolbar */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 border-b border-white/8 sm:border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/40 sm:text-white/30 bg-white/[0.08] sm:bg-white/[0.05] rounded-lg px-2 sm:px-3 py-1.5 max-w-[140px] sm:max-w-[180px] flex-1 border border-white/20 sm:border-transparent">
          <Search size={11} className="sm:w-3 sm:h-3" /> Поиск…
        </div>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#FF6B35] bg-[#FF6B35]/15 sm:bg-[#FF6B35]/10 border border-[#FF6B35]/40 sm:border-[#FF6B35]/30 rounded-lg px-2 sm:px-2.5 py-1 cursor-pointer hover:bg-[#FF6B35]/25 transition-colors">
            <Plus size={10} className="sm:w-3 sm:h-3" /> <span className="hidden sm:inline">Добавить</span>
          </span>
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-white/45 sm:text-white/35 bg-white/[0.06] sm:bg-white/[0.04] border border-white/10 sm:border-white/[0.08] rounded-lg px-2 sm:px-2.5 py-1 cursor-pointer hover:bg-white/[0.10] transition-colors">
            <Download size={10} className="sm:w-3 sm:h-3" /> <span className="hidden sm:inline">Экспорт</span>
          </span>
        </div>
      </div>

      {/* table with scroll */}
      <div className="overflow-x-auto">
        <div className="min-w-[650px] xl:min-w-[500px]">
          {/* head */}
          <div className="grid grid-cols-[2fr_1fr_0.6fr_1fr] px-3 sm:px-4 py-2 sm:py-2 border-b border-white/8 sm:border-white/[0.06] bg-white/[0.02]">
            {["Наименование","Артикул","Кол-во","Статус"].map(h => (
              <span key={h} className="text-[10px] sm:text-[11px] font-semibold text-white/40 sm:text-white/30 uppercase tracking-widest">{h}</span>
            ))}
          </div>

          {/* rows */}
          {rows.map((r, i) => (
            <div key={i} className={`grid grid-cols-[2fr_1fr_0.6fr_1fr] px-3 sm:px-4 py-2.5 sm:py-2.5 border-b border-white/[0.06] sm:border-white/[0.04] transition-colors duration-300 ${hi === i ? "bg-[#FF6B35]/[0.08]" : ""}`}>
              <span className="text-[13px] sm:text-[13px] text-white/90 sm:text-white/80 truncate font-medium sm:font-normal">{r.name}</span>
              <span className="text-[11px] sm:text-[12px] font-mono text-white/50 sm:text-white/40">{r.sku}</span>
              <span className="text-[13px] sm:text-[13px] text-white/75 sm:text-white/65 font-medium sm:font-normal">{r.qty}</span>
              <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border w-fit ${(statusStyle as Record<string, string>)[r.status] ?? ""}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}