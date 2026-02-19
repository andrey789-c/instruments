"use client";

import { useEffect, useState } from "react";
import { Download, Plus, Search } from "lucide-react";

const rows = [
  {
    name: "Наушники Sony WH-1000",
    sku: "SON-001",
    qty: 24,
    status: "В наличии",
  },
  { name: "Кабель USB-C 1м", sku: "CBL-047", qty: 7, status: "Мало" },
  { name: "Чехол iPhone 15 Pro", sku: "CSE-112", qty: 0, status: "Нет" },
  { name: "Зарядка 65W GaN", sku: "CHG-033", qty: 51, status: "В наличии" },
  { name: "Стекло защитное", sku: "GLS-009", qty: 3, status: "Мало" },
];

const statusStyle = {
  "В наличии": "bg-emerald-500/10 text-emerald-600 border-emerald-500/25",
  "Мало": "bg-yellow-500/10  text-yellow-600  border-yellow-500/25",
  "Нет": "bg-red-500/10     text-red-500     border-red-500/25",
};

export function TablePreview() {
  const [hi, setHi] = useState<number | null>(null);
  useEffect(() => {
    const t = setInterval(
      () => setHi(Math.floor(Math.random() * rows.length)),
      1800,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-[#0D0F14]/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:shadow-[0_32px_80px_rgba(0,0,0,0.10)]">
      {/* chrome */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#0D0F14]/08 bg-[#0D0F14]/[0.02]">
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400" />
        <span className="ml-2 sm:ml-4 text-[10px] sm:text-[11px] text-[#0D0F14]/35 font-mono truncate">
          📦 Склад — Электроника
        </span>
      </div>

      {/* toolbar */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 border-b border-[#0D0F14]/06 bg-[#0D0F14]/[0.01]">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0D0F14]/35 bg-[#0D0F14]/[0.04] rounded-lg px-2 sm:px-3 py-1.5 max-w-[140px] sm:max-w-[180px] flex-1 border border-[#0D0F14]/08">
          <Search size={11} className="sm:w-3 sm:h-3" /> Поиск…
        </div>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#FF6B35] bg-[#FF6B35]/10 border border-[#FF6B35]/25 rounded-lg px-2 sm:px-2.5 py-1 cursor-pointer hover:bg-[#FF6B35]/20 transition-colors">
            <Plus size={10} className="sm:w-3 sm:h-3" />{" "}
            <span className="hidden sm:inline">Добавить</span>
          </span>
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0D0F14]/40 bg-[#0D0F14]/[0.04] border border-[#0D0F14]/08 rounded-lg px-2 sm:px-2.5 py-1 cursor-pointer hover:bg-[#0D0F14]/[0.08] transition-colors">
            <Download size={10} className="sm:w-3 sm:h-3" />{" "}
            <span className="hidden sm:inline">Экспорт</span>
          </span>
        </div>
      </div>

      {/* table with scroll */}
      <div className="overflow-x-auto">
        <div className="min-w-[650px] xl:min-w-[500px]">
          {/* head */}
          <div className="grid grid-cols-[2fr_1fr_0.6fr_1fr] px-3 sm:px-4 py-2 border-b border-[#0D0F14]/06 bg-[#0D0F14]/[0.02]">
            {["Наименование", "Артикул", "Кол-во", "Статус"].map((h) => (
              <span
                key={h}
                className="text-[10px] sm:text-[11px] font-semibold text-[#0D0F14]/35 uppercase tracking-widest"
              >
                {h}
              </span>
            ))}
          </div>

          {/* rows */}
          {rows.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-[2fr_1fr_0.6fr_1fr] px-3 sm:px-4 py-2.5 border-b border-[#0D0F14]/[0.05] transition-colors duration-300 ${
                hi === i ? "bg-[#FF6B35]/[0.05]" : ""
              }`}
            >
              <span className="text-[13px] text-[#0D0F14]/85 truncate font-medium">
                {r.name}
              </span>
              <span className="text-[11px] sm:text-[12px] font-mono text-[#0D0F14]/40">
                {r.sku}
              </span>
              <span className="text-[13px] text-[#0D0F14]/65 font-medium">
                {r.qty}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border w-fit ${
                  (statusStyle as Record<string, string>)[r.status] ?? ""
                }`}
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
