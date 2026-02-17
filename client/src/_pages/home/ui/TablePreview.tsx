"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { Search, Download, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const rows = [
  { name: "Наушники Sony WH-1000", sku: "SON-001", qty: 24, status: "В наличии" },
  { name: "Кабель USB-C 1м",       sku: "CBL-047", qty: 7,  status: "Мало"      },
  { name: "Чехол iPhone 15 Pro",   sku: "CSE-112", qty: 0,  status: "Нет"       },
  { name: "Зарядка 65W GaN",       sku: "CHG-033", qty: 51, status: "В наличии" },
  { name: "Стекло защитное",       sku: "GLS-009", qty: 3,  status: "Мало"      },
] as const;

type Status = (typeof rows)[number]["status"];

const statusVariant: Record<Status, { variant: "success" | "warning" | "destructive"; label: string }> = {
  "В наличии": { variant: "success",     label: "В наличии" },
  "Мало":      { variant: "warning",     label: "Мало"      },
  "Нет":       { variant: "destructive", label: "Нет"       },
};

export function TablePreview() {
  const [highlight, setHighlight] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(
      () => setHighlight(Math.floor(Math.random() * rows.length)),
      1800,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0f1117] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
      {/* ── window chrome ── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/[0.04]">
        <span className="w-3 h-3 rounded-full bg-red-400/80"   />
        <span className="w-3 h-3 rounded-full bg-yellow-400/80"/>
        <span className="w-3 h-3 rounded-full bg-emerald-400/80"/>
        <span className="ml-4 text-[11px] text-white/30 font-mono">
          📦 Склад — Электроника
        </span>
      </div>

      {/* ── toolbar ── */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.06]">
        <div className="relative flex-1 max-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <Input
            readOnly
            placeholder="Поиск…"
            className="h-8 pl-8 text-xs bg-white/[0.05] border-white/10 text-white/35 placeholder:text-white/25 focus-visible:ring-0"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-3 text-[11px] text-[#FF6B35] bg-[#FF6B35]/10 border border-[#FF6B35]/30 hover:bg-[#FF6B35]/20"
          >
            <Plus className="w-3 h-3 mr-1" />
            Добавить строку
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-3 text-[11px] text-white/35 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]"
          >
            <Download className="w-3 h-3 mr-1" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* ── table head ── */}
      <div className="grid grid-cols-[2fr_1fr_0.6fr_1fr] px-4 py-2 border-b border-white/[0.06]">
        {["Наименование", "Артикул", "Кол-во", "Статус"].map((h) => (
          <span
            key={h}
            className="text-[11px] font-semibold text-white/30 uppercase tracking-widest"
          >
            {h}
          </span>
        ))}
      </div>

      {/* ── rows ── */}
      {rows.map((r, i) => (
        <div
          key={i}
          className={cn(
            "grid grid-cols-[2fr_1fr_0.6fr_1fr] px-4 py-2.5 border-b border-white/[0.04] transition-colors duration-300",
            highlight === i ? "bg-[#FF6B35]/[0.06]" : "bg-transparent",
          )}
        >
          <span className="text-[13px] text-white/80 truncate">{r.name}</span>
          <span className="text-[12px] font-mono text-white/40">{r.sku}</span>
          <span className="text-[13px] text-white/65">{r.qty}</span>
          <Badge
            variant={statusVariant[r.status]?.variant as any}
            className="w-fit text-[11px] font-semibold"
          >
            {r.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}