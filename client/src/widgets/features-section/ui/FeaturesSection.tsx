import { FEATURES } from "../config/features";




export function FeaturesSection() {
  return (
    <section
      className="relative bg-[#F8F7F4] overflow-hidden py-20 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-16"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      

      {/* Glow */}
      <div
        className="absolute top-1/2 -translate-y-1/2 right-0 w-[600px] sm:w-[900px] h-[500px] sm:h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse,rgba(255,107,53,0.08) 0%,transparent 70%)",
        }}
      />

      <div id="possibilities" className="relative z-10 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-16 lg:mb-20 gap-4">
          <span className="w-fit bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30 rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-semibold">
            Всё что нужно
          </span>

          <h2 className="text-[1.9rem] sm:text-4xl md:text-5xl font-black text-[#0D0F14] leading-[1.1] tracking-[-0.03em] m-0 max-w-[700px]">
            Ключевые возможности
          </h2>

          <p className="text-[#0D0F14]/50 text-[15px] sm:text-base leading-relaxed max-w-[560px] m-0">
            Мы собрали только самое важное — без лишних функций, 
            которые никто не использует.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group relative bg-white border border-[#0D0F14]/06 rounded-2xl p-6 sm:p-7 hover:border-[#0D0F14]/12 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                {/* Icon container */}
                <div className={`w-12 h-12 rounded-xl ${feature.lightBg} border ${feature.borderColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className={`${feature.color.replace('bg-', 'text-')}`} />
                </div>

                {/* Content */}
                <h3 className="text-[#0D0F14] text-[17px] sm:text-lg font-bold mb-2 m-0">
                  {feature.title}
                </h3>
                <p className="text-[#0D0F14]/50 text-[14px] sm:text-[15px] leading-relaxed m-0">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${feature.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col items-center gap-4 mt-14 sm:mt-16">
          <p className="text-[#0D0F14]/40 text-sm m-0">
            И это только начало — мы добавляем новые фичи каждую неделю
          </p>
          <button className="text-[#FF6B35] font-semibold text-sm hover:text-[#ff7a46] transition-colors border-none bg-transparent cursor-pointer underline decoration-[#FF6B35]/30 underline-offset-4 hover:decoration-[#FF6B35]">
            Посмотреть дорожную карту →
          </button>
        </div>
      </div>
    </section>
  );
}