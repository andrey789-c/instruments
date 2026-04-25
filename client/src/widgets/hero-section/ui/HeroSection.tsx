"use client";

import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authApi } from "@/src/shared/api";
import { Navbar } from "@/src/widgets/header/ui";
import { TablePreview } from "./TablePreview";

const AVATARS = [
  ["bg-violet-500",  "АЛ"],
  ["bg-sky-500",     "МК"],
  ["bg-emerald-500", "НС"],
  ["bg-amber-500",   "ДВ"],
];

export function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
  }, []);

  const primaryHref = isAuthenticated ? "/dashboard" : "/auth/register";
  const secondaryHref = isAuthenticated ? "/dashboard" : "/auth/login";
  const primaryLabel = isAuthenticated ? "Перейти в dashboard" : "Начать бесплатно";
  const secondaryLabel = isAuthenticated ? "Открыть dashboard" : "Посмотреть демо";

  return (
    <div className="relative min-h-screen bg-[#F8F7F4] overflow-hidden flex flex-col" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] pointer-events-none"
        style={{ background:"radial-gradient(ellipse,rgba(255,107,53,0.10) 0%,transparent 70%)" }} />

      <Navbar />

      {/* hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center gap-8 sm:gap-10 lg:gap-0 px-4 sm:px-8 lg:px-16 py-6 sm:py-10 pb-10 sm:pb-16 max-w-[1400px] mx-auto w-full">

        {/* Content wrapper for desktop side-by-side */}
        <div className="flex flex-col xl:flex-row items-center gap-8 sm:gap-10 xl:gap-32 w-full">
          
          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-6 sm:gap-7 max-w-full xl:max-w-[620px] text-center xl:text-left items-center xl:items-start">

            <span className="w-fit bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 rounded-full px-3 sm:px-3.5 py-1.5 sm:py-1 text-[11px] sm:text-xs font-semibold">
              ✦ Без CRM. Без Excel. Без головной боли.
            </span>

            <h1 className="text-[2rem] sm:text-4xl md:text-5xl xl:text-[clamp(2.2rem,4vw,3.4rem)] font-black text-[#0D0F14] leading-[1.15] sm:leading-[1.06] tracking-[-0.03em] m-0">
              Ваш склад —<br />
              <span className="text-[#FF6B35]">в одной таблице.</span><br />
              Для всей команды.
            </h1>

            <p className="text-[#0D0F14]/55 text-[15px] sm:text-base xl:text-[17px] leading-relaxed m-0 max-w-[480px]">
              Управляйте инвентарём без громоздких CRM-систем.
              Создайте таблицу, пригласите сотрудников и работайте — буквально за&nbsp;5&nbsp;минут.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto">
              <Link href={primaryHref} className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ff7a46] transition-colors border-none text-white font-bold text-sm sm:text-[15px] px-6 sm:px-7 py-5 sm:py-6 rounded-2xl cursor-pointer shadow-[0_12px_32px_rgba(255,107,53,0.28)] w-full sm:w-auto justify-center">
                {primaryLabel} <ArrowRight size={16} />
              </Link>

              <Link href={secondaryHref} className="flex items-center gap-3 bg-transparent border-none text-[#0D0F14]/50 text-sm cursor-pointer hover:text-[#0D0F14]/80 transition-colors">
                <span className="w-10 h-10 rounded-full border border-[#0D0F14]/20 flex items-center justify-center">
                  <Play size={13} className="text-[#0D0F14]/50 fill-[#0D0F14]/50" />
                </span>
                {secondaryLabel}
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <div className="flex">
                {AVATARS.map(([bg, label], i) => (
                  <div key={i} style={{ marginLeft: i > 0 ? -8 : 0 }}
                    className={`w-8 h-8 rounded-full ${bg} border-2 border-[#F8F7F4] flex items-center justify-center text-[9px] text-white font-bold`}>
                    {label}
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-[#0D0F14]/45 m-0">
                Подходит для складов, магазинов и небольших команд
              </p>
            </div>
          </div>

          {/* RIGHT (desktop only) */}
          <div className="hidden lg:flex flex-1 w-full max-w-[670px] justify-center relative">
            <TablePreview />
          </div>
        </div>

        {/* Table (mobile/tablet only - below text) */}
        <div className="flex lg:hidden w-full max-w-[620px] relative">
          <TablePreview />
        </div>

      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 pointer-events-none"
        style={{ background:"linear-gradient(to top, #F8F7F4, transparent)" }} />
    </div>
  );
}