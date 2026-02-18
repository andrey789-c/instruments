import { ArrowRight, Play, TrendingUp, Users } from "lucide-react";
import { TablePreview } from "./TablePreview";
import { Counter } from "@/src/shared/ui";
import { Navbar } from "@/src/widgets/header/ui";

const AVATARS = [
  ["bg-violet-500",  "АЛ"],
  ["bg-sky-500",     "МК"],
  ["bg-emerald-500", "НС"],
  ["bg-amber-500",   "ДВ"],
];

export function HeroSection() {
  return (
    <div className="relative min-h-screen bg-[#080A0F] overflow-hidden flex flex-col" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* grid bg */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"48px 48px" }} />

      {/* glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] pointer-events-none"
        style={{ background:"radial-gradient(ellipse,rgba(255,107,53,0.12) 0%,transparent 70%)" }} />

      <Navbar />

      {/* hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center gap-8 sm:gap-10 lg:gap-0 px-4 sm:px-8 lg:px-16 py-6 sm:py-10 pb-10 sm:pb-16 max-w-[1400px] mx-auto w-full">

        {/* Content wrapper for desktop side-by-side */}
        <div className="flex flex-col xl:flex-row items-center gap-8 sm:gap-10 xl:gap-32 w-full">
          
          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-6 sm:gap-7 max-w-full xl:max-w-[620px] text-center xl:text-left items-center xl:items-start">

            <span className="w-fit bg-[#FF6B35]/12 sm:bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/40 sm:border-[#FF6B35]/30 rounded-full px-3 sm:px-3.5 py-1.5 sm:py-1 text-[11px] sm:text-xs font-semibold">
              ✦ Без CRM. Без Excel. Без головной боли.
            </span>

            <h1 className="text-[2rem] sm:text-4xl md:text-5xl xl:text-[clamp(2.2rem,4vw,3.4rem)] font-black text-white leading-[1.15] sm:leading-[1.06] tracking-[-0.03em] m-0">
              Ваш склад —<br />
              <span className="text-[#FF6B35]">в одной таблице.</span><br />
              Для всей команды.
            </h1>

            <p className="text-white/60 sm:text-white/[0.52] text-[15px] sm:text-base xl:text-[17px] leading-relaxed m-0 max-w-[480px]">
              Управляйте инвентарём без громоздких CRM-систем.
              Создайте таблицу, пригласите сотрудников и работайте — буквально за&nbsp;5&nbsp;минут.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto">
              <button className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ff7a46] transition-colors border-none text-white font-bold text-sm sm:text-[15px] px-6 sm:px-7 py-5 sm:py-6 rounded-2xl cursor-pointer shadow-[0_12px_32px_rgba(255,107,53,0.35)] sm:shadow-[0_12px_32px_rgba(255,107,53,0.3)] w-full sm:w-auto justify-center">
                Начать бесплатно <ArrowRight size={16} />
              </button>

              <button className="flex items-center gap-3 bg-transparent border-none text-white/60 sm:text-white/55 text-sm cursor-pointer hover:text-white/80 transition-colors">
                <span className="w-10 h-10 rounded-full border border-white/25 sm:border-white/20 flex items-center justify-center">
                  <Play size={13} className="text-white/60 fill-white/60" />
                </span>
                Посмотреть демо
              </button>
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <div className="flex">
                {AVATARS.map(([bg, label], i) => (
                  <div key={i} style={{ marginLeft: i > 0 ? -8 : 0 }}
                    className={`w-8 h-8 rounded-full ${bg} border-2 border-[#080A0F] flex items-center justify-center text-[9px] text-white font-bold`}>
                    {label}
                  </div>
                ))}
              </div>
              <p className="text-[13px] sm:text-[13px] text-white/50 sm:text-white/40 m-0">
                <span className="text-white font-semibold">+2 400</span> владельцев бизнеса уже используют
              </p>
            </div>
          </div>

          {/* RIGHT (desktop only) */}
          <div className="hidden lg:flex flex-1 w-full max-w-[670px] justify-center relative">
            {/* <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-white/[0.05] bg-white/[0.015]" /> */}
            <TablePreview />

            {/* desktop stat badges */}
            <div className="hidden xl:flex absolute -left-20 top-1/3 bg-[#0f1117] border border-white/10 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex-col gap-1">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-white font-bold text-lg leading-none"><Counter end={1284} /></span>
              <span className="text-white/[0.38] text-[11px]">изменений сегодня</span>
            </div>

            <div className="hidden xl:flex absolute right-10 bottom-12 bg-[#0f1117] border border-white/10 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex-col gap-1">
              <Users size={16} className="text-[#FF6B35]" />
              <span className="text-white font-bold text-lg leading-none"><Counter end={3} suffix=" роли" /></span>
              <span className="text-white/[0.38] text-[11px]">для вашей команды</span>
            </div>
          </div>
        </div>

        {/* Table (mobile/tablet only - below text) */}
        <div className="flex lg:hidden w-full max-w-[620px] relative">
          {/* <div className="hidden sm:block absolute inset-0 translate-x-2 translate-y-2 rounded-2xl border border-white/[0.05] bg-white/[0.015]" /> */}
          <TablePreview />
        </div>

        {/* Mobile stat badges */}
        <div className="flex lg:hidden gap-3 sm:gap-4 justify-center w-full max-w-[400px]">
          <div className="flex bg-[#0f1117] border border-white/15 sm:border-white/10 rounded-xl sm:rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.7)] sm:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex-col gap-1.5 sm:gap-1 items-center flex-1">
            <TrendingUp size={16} className="text-emerald-400 sm:w-4 sm:h-4" />
            <span className="text-white font-bold text-lg leading-none"><Counter end={1284} /></span>
            <span className="text-white/50 sm:text-white/[0.38] text-[11px] text-center">изменений сегодня</span>
          </div>

          <div className="flex bg-[#0f1117] border border-white/15 sm:border-white/10 rounded-xl sm:rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.7)] sm:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex-col gap-1.5 sm:gap-1 items-center flex-1">
            <Users size={16} className="text-[#FF6B35] sm:w-4 sm:h-4" />
            <span className="text-white font-bold text-lg leading-none"><Counter end={3} suffix=" роли" /></span>
            <span className="text-white/50 sm:text-white/[0.38] text-[11px] text-center">для вашей команды</span>
          </div>
        </div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 pointer-events-none"
        style={{ background:"linear-gradient(to top, #080A0F, transparent)" }} />
    </div>
  );
}