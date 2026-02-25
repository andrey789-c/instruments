import { STEPS } from "../config/steps";

export function StepsWork() {
  return (
    <section
      className="relative bg-white overflow-hidden py-20 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-16"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >

      {/* Glow */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[500px] sm:h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse,rgba(255,107,53,0.06) 0%,transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-16 lg:mb-20 gap-4">
          <span className="w-fit bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-semibold">
            3 простых шага
          </span>

          <h2 className="text-[1.9rem] sm:text-4xl md:text-5xl font-black text-[#0D0F14] leading-[1.1] tracking-[-0.03em] m-0 max-w-[600px]">
            Как это работает?
          </h2>

          <p className="text-[#0D0F14]/50 text-[15px] sm:text-base leading-relaxed max-w-[520px] m-0">
            От регистрации до первой записи в таблице — буквально 5 минут. Без
            настроек, без обучения, без специалистов.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative group"
              >
                {/* Connecting line (desktop only) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-14 left-[calc(50%+40px)] right-[calc(-100%-40px)] h-[2px] bg-gradient-to-r from-[#FF6B35]/30 to-transparent" />
                )}

                <div className="relative bg-[#F8F7F4] border border-[#0D0F14]/06 rounded-2xl p-6 sm:p-7 lg:p-8 hover:border-[#FF6B35]/20 hover:shadow-[0_12px_40px_rgba(255,107,53,0.12)] transition-all duration-300 h-full">
                  {/* Number badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[#FF6B35] text-white font-black text-sm flex items-center justify-center shadow-[0_6px_20px_rgba(255,107,53,0.35)]">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-white border border-[#0D0F14]/08 flex items-center justify-center mb-5 group-hover:border-[#FF6B35]/30 group-hover:shadow-[0_8px_24px_rgba(255,107,53,0.15)] transition-all">
                    <Icon size={24} className="text-[#FF6B35]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-[#0D0F14] text-lg sm:text-xl font-bold mb-2 m-0">
                    {step.title}
                  </h3>
                  <p className="text-[#0D0F14]/50 text-[14px] sm:text-[15px] leading-relaxed m-0">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="flex items-center justify-center mt-12 sm:mt-14">
          <div className="bg-[#F8F7F4] border border-[#0D0F14]/08 rounded-full px-5 py-3 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-[#0D0F14]/60 text-sm font-medium">
              Средняя настройка:{" "}
              <span className="text-[#0D0F14] font-bold">
                5 мин
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
