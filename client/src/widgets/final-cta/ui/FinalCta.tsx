import { ArrowRight, Check, Clock, Headphones } from "lucide-react";

export const FinalCta = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-16 bg-gradient-to-br from-[#FF6B35] via-[#ff7a46] to-[#ff8557] overflow-hidden">
      {/* Декоративный glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center text-white">
          {/* Badge */}
          <div className="inline-block mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
              ✦ Специальное предложение
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 leading-tight tracking-[-0.02em]">
            Готовы упростить<br className="hidden sm:block" /> управление складом?
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 lg:mb-12 opacity-95 leading-relaxed max-w-2xl mx-auto">
            Настройте первую таблицу за 5 минут — бесплатно.<br />
            Никаких кредитных карт. Никаких обязательств.
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 lg:mb-12 flex-wrap max-w-3xl mx-auto">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-white/20">
              <Check size={18} className="flex-shrink-0 text-white" strokeWidth={3} />
              <span className="font-semibold text-sm sm:text-base">Бесплатно навсегда</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-white/20">
              <Clock size={18} className="flex-shrink-0 text-white" />
              <span className="font-semibold text-sm sm:text-base">Настройка за 5 минут</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl border border-white/20">
              <Headphones size={18} className="flex-shrink-0 text-white" />
              <span className="font-semibold text-sm sm:text-base">Поддержка 24/7</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 sm:mb-10">
            <button className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-4 sm:py-5 bg-white text-[#FF6B35] rounded-2xl text-base sm:text-lg font-bold cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl shadow-lg">
              Начать бесплатно
              <ArrowRight size={18} />
            </button>
            <button className="px-7 sm:px-8 py-4 sm:py-5 bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 rounded-2xl text-base sm:text-lg font-semibold cursor-pointer transition-all hover:-translate-y-1 hover:bg-white/20">
              Посмотреть демо
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 text-sm opacity-95">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-violet-500 border-2 border-white flex items-center justify-center text-xs font-bold">АЛ</div>
              <div className="w-8 h-8 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center text-xs font-bold">МК</div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xs font-bold">НС</div>
              <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-xs font-bold">+2K</div>
            </div>
            <p className="font-semibold">
              Присоединяйтесь к 2,400+ владельцам бизнеса
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};