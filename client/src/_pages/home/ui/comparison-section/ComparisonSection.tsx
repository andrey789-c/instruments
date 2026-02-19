import { ArrowRight } from "lucide-react";
import { ComparisonRow } from "@/src/shared/ui";
import { COMPARISON_ROWS } from "../../model/comparison-rows";


export function ComparisonSection() {

  return (
    <section
      className="relative bg-[#F8F7F4] overflow-hidden py-24 px-4 sm:px-8 lg:px-16"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Grid bg — same as Hero */}
     

      {/* Glow */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse,rgba(255,107,53,0.08) 0%,transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex flex-col  mb-12 gap-4">
          <span className="w-fit bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-semibold">
            Честное сравнение
          </span>

          <h2 className="text-[1.9rem] sm:text-4xl md:text-5xl font-black text-[#0D0F14] leading-[1.1] tracking-[-0.03em] m-0">
            Почему мы лучше CRM?
          </h2>

          <p className="text-[#0D0F14]/50 text-[15px] sm:text-base leading-relaxed max-w-[480px] m-0">
            Bitrix и AmoCRM созданы для всех — а значит, ни для кого конкретно.
            Мы сделали инструмент, который работает именно так, как нужно вам.
          </p>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border border-[#0D0F14]/08 shadow-[0_8px_40px_rgba(0,0,0,0.07)] bg-white">
          {/* Column headers */}
          <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[1.4fr_1fr_1fr] bg-[#F8F7F4] border-b border-[#0D0F14]/06">
            <div className="px-5 py-3.5 text-[11px] font-semibold text-[#0D0F14]/30 uppercase tracking-widest">
              Критерий
            </div>
            <div className="px-5 py-3.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6B35] inline-block" />
              <span className="text-sm font-bold text-[#0D0F14]">Наш сервис</span>
            </div>
            <div className="px-5 py-3.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0D0F14]/20 inline-block" />
              <span className="text-sm font-semibold text-[#0D0F14]/40">
                Bitrix / AmoCRM
              </span>
            </div>
          </div>

          {/* Rows */}
          {COMPARISON_ROWS.map((row, i) => (
            <div
              key={i}
            >
              <ComparisonRow
                feature={row.feature}
                us={row.us}
                crm={row.crm}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 mb-10">
          <button className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ff7a46] transition-colors border-none text-white font-bold text-sm sm:text-[15px] px-6 sm:px-7 py-5 sm:py-6 rounded-2xl cursor-pointer shadow-[0_12px_32px_rgba(255,107,53,0.28)] w-full sm:w-auto justify-center">
            Начать бесплатно <ArrowRight size={16} />
          </button>
        
        </div>

        {/* Footnote */}
        <p className="text-center text-[13px] text-[#0D0F14]/35 mt-6 m-0">
          <span className="text-[#0D0F14]/60 font-semibold">+2 400</span> команд
          перешли к нам из Bitrix и AmoCRM за последний год
        </p>
      </div>

      {/* bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 pointer-events-none"
        style={{ background: "linear-gradient(to top, #F8F7F4, transparent)" }}
      />
    </section>
  );
}