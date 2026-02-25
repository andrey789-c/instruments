"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/lib/utils";


import "swiper/css";
import { PAIN_CARDS } from "../config/paint-points";

// Уникальный префикс на случай нескольких экземпляров на странице
const NAV_PREV = "pain-points-prev";
const NAV_NEXT = "pain-points-next";

export function PainPoints() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full overflow-hidden bg-[#F8F7F4] py-20 sm:py-14 xl:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#F0EDE8] to-transparent" />

     

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 xl:px-8">
        <div className="mb-12 flex items-end justify-between sm:mb-8 xl:mb-16">
          <div>
            <span className="mb-3 inline-block rounded-full border border-red-500/25 bg-red-500/8 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-500">
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

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <button
              id={NAV_PREV}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-[#0D0F14]/12 bg-white",
                "transition-all duration-200 hover:border-[#0D0F14]/25 hover:shadow-md",
                "[&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:opacity-30",
              )}
              aria-label="Предыдущий слайд"
            >
              <ChevronLeft className="h-4 w-4 text-[#0D0F14]" />
            </button>
            <button
              id={NAV_NEXT}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-[#0D0F14]/12 bg-white",
                "transition-all duration-200 hover:border-[#0D0F14]/25 hover:shadow-md",
                "[&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:opacity-30",
              )}
              aria-label="Следующий слайд"
            >
              <ChevronRight className="h-4 w-4 text-[#0D0F14]" />
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation]}
          onSlideChange={(swiper: SwiperType) =>
            setActiveIndex(swiper.activeIndex)}
          // Карточки одинаковой высоты
          style={{ alignItems: "stretch" }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 12 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          navigation={{
            prevEl: `#${NAV_PREV}`,
            nextEl: `#${NAV_NEXT}`,
          }}
          className="!overflow-visible [&_.swiper-slide]:h-auto"
        >
          {PAIN_CARDS.map((card, i) => (
            <SwiperSlide key={card.id} className="!h-auto">
              <Card
                className={cn(
                  // h-full + flex-col чтобы карточка растягивалась на всю высоту слайда
                  "group relative flex h-full w-full flex-col overflow-hidden",
                  "border border-[#0D0F14]/8 bg-white",
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

                <CardContent className="flex flex-1 flex-col p-6 sm:p-4 xl:p-7">
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

                  {/* Description — прижата к низу через mt-auto */}
                  <p className="mt-auto text-sm leading-relaxed text-[#0D0F14]/50 sm:text-xs xl:text-[15px]">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dots pagination — visible only below lg */}
        <div className="mt-6 flex justify-center gap-2 lg:hidden">
          {PAIN_CARDS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "block h-1.5 rounded-full transition-all duration-300",
                i === activeIndex ? "w-6 bg-red-500" : "w-1.5 bg-[#0D0F14]/20",
              )}
            />
          ))}
        </div>

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
