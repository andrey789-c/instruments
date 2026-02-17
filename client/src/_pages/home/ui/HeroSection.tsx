import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";
import { ArrowRight, Play, TrendingUp, Users } from "lucide-react";
import { Counter } from "@/src/shared/ui";
import { TablePreview } from "./TablePreview";
import { Navbar } from "@/src/widgets/header/ui";

const AVATARS: [string, string][] = [
  ["bg-violet-500",  "АЛ"],
  ["bg-sky-500",     "МК"],
  ["bg-emerald-500", "НС"],
  ["bg-amber-500",   "ДВ"],
];

export function HeroSection() {
  return (
    <div className="relative min-h-screen bg-[#080A0F] font-sans overflow-hidden flex flex-col">

      {/* ── grid bg ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── radial glow ── */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(255,107,53,0.12)_0%,transparent_70%)] pointer-events-none" />

      <Navbar />

      {/* ── hero body ── */}
      <div className="relative z-10 flex-1 flex items-center gap-16 px-16 py-10 pb-16 max-w-[1400px] mx-auto w-full">

        {/* ── LEFT copy ── */}
        <div className="flex-1 flex flex-col gap-7 max-w-[520px]">

          <Badge className="w-fit bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 hover:bg-[#FF6B35]/20 rounded-full px-3.5 py-1 text-xs font-semibold">
            ✦ Без CRM. Без Excel. Без головной боли.
          </Badge>

          <h1 className="text-[clamp(2.2rem,4vw,3.4rem)] font-black text-white leading-[1.06] tracking-[-0.03em] m-0">
            Ваш склад —<br />
            <span className="text-[#FF6B35]">в одной таблице.</span>
            <br />
            Для всей команды.
          </h1>

          <p className="text-white/52 text-[17px] leading-relaxed m-0">
            Управляйте инвентарём без громоздких CRM-систем.
            Создайте таблицу, пригласите сотрудников и работайте — буквально
            за&nbsp;5&nbsp;минут.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-5">
            <Button className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ff7a46] text-white font-bold text-[15px] px-7 py-6 rounded-2xl shadow-[0_12px_32px_rgba(255,107,53,0.3)]">
              Начать бесплатно
              <ArrowRight size={16} />
            </Button>

            <button className="flex items-center gap-3 bg-transparent border-none text-white/55 text-sm cursor-pointer hover:text-white/80 transition-colors">
              <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <Play size={13} className="text-white/60 fill-white/60" />
              </span>
              Посмотреть демо
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex">
              {AVATARS.map(([bg, label], i) => (
                <div
                  key={i}
                  style={{ marginLeft: i > 0 ? -8 : 0 }}
                  className={`w-8 h-8 rounded-full ${bg} border-2 border-[#080A0F] flex items-center justify-center text-[9px] text-white font-bold`}
                >
                  {label}
                </div>
              ))}
            </div>
            <p className="text-[13px] text-white/40 m-0">
              <span className="text-white font-semibold">+2 400</span> владельцев бизнеса уже используют
            </p>
          </div>
        </div>

        {/* ── RIGHT preview ── */}
        <div className="flex-1 max-w-[620px] relative">
          {/* shadow card */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-white/[0.05] bg-white/[0.015]" />

          <TablePreview />

          {/* stat badge left */}
          <div className="absolute -left-20 top-1/3 bg-[#0f1117] border border-white/10 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-1">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-white font-bold text-lg leading-none">
              <Counter end={1284} />
            </span>
            <span className="text-white/38 text-[11px]">изменений сегодня</span>
          </div>

          {/* stat badge right */}
          <div className="absolute -right-20 bottom-12 bg-[#0f1117] border border-white/10 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-1">
            <Users size={16} className="text-[#FF6B35]" />
            <span className="text-white font-bold text-lg leading-none">
              <Counter end={3} suffix=" роли" />
            </span>
            <span className="text-white/38 text-[11px]">для вашей команды</span>
          </div>
        </div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#080A0F] to-transparent pointer-events-none" />
    </div>
  );
}