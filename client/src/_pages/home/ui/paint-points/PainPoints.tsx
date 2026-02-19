import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PAIN_CARDS } from "../../model/pain-points";

export function PainPoints() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F8F7F4] py-20 sm:py-14 xl:py-28">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#F0EDE8] to-transparent" />

      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/08 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 xl:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-8 xl:mb-16">
          <span className="mb-3 inline-block rounded-full border border-red-500/25 bg-red-500/08 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-500">
            Проблема
          </span>
          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-tight text-[#0D0F14] sm:text-3xl xl:text-5xl">
            Вам это{" "}
            <span className="relative inline-block">
              знакомо?
              <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-gradient-to-r from-red-500 to-transparent" />
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#0D0F14]/50 sm:text-sm xl:text-lg">
            Малый бизнес каждый день сталкивается с одними и теми же
            препятствиями. Мы создали решение именно для этих случаев.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 sm:gap-3 xl:grid-cols-4 xl:gap-6">
          {PAIN_CARDS.map((card, i) => (
            <Card
              key={card.id}
              className={cn(
                "group relative overflow-hidden border border-[#0D0F14]/08 bg-white",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)]",
                card.accent,
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Inner glow on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0D0F14]/[0.02] to-transparent" />
              </div>

              <CardContent className="p-6 sm:p-4 xl:p-7">
                {/* Emoji badge */}
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#0D0F14]/10 bg-[#0D0F14]/[0.04] text-2xl sm:mb-3 sm:h-10 sm:w-10 sm:text-xl xl:mb-6 xl:h-14 xl:w-14 xl:text-3xl">
                  {card.emoji}
                </div>

                {/* Number */}
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#0D0F14]/25 sm:text-[10px]">
                  {String(card.id).padStart(2, "0")}
                </span>

                {/* Title */}
                <h3 className="mb-3 text-lg font-bold leading-snug text-[#0D0F14] sm:mb-2 sm:text-base xl:mb-4 xl:text-xl">
                  {card.title}
                </h3>

                {/* Divider */}
                <div className="mb-3 h-px w-8 bg-[#0D0F14]/12 sm:mb-2 xl:mb-4" />

                {/* Description */}
                <p className="text-sm leading-relaxed text-[#0D0F14]/50 sm:text-xs xl:text-[15px]">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="mt-10 flex items-center gap-3 sm:mt-6 xl:mt-14">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#0D0F14]/15 to-transparent" />
          <p className="text-sm font-medium text-[#0D0F14]/35 sm:text-xs">
            Если хотя бы один пункт про вас — читайте дальше
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#0D0F14]/15 to-transparent" />
        </div>
      </div>
    </section>
  );
}