"use client";

import { Menu, Package, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authApi } from "@/src/shared/api";

const NAV = [
  {label: 'Возможности', value: '#possibilities'},
  {label: 'Тарифы', value: '#price'},
  {label: 'FAQ', value: '#faq'}
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
  }, []);

  return (
    <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 lg:px-16 py-4 sm:py-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-[#FF6B35] flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.28)]">
          <Package size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
        </div>
        <span className="text-[#0D0F14] font-black text-base sm:text-lg tracking-tight">
          StockFlow
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {NAV.map((item) => (
          <a
            key={item.value}
            href={item.value}
            className="text-[#0D0F14]/45 text-sm hover:text-[#0D0F14]/75 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>

      {!isAuthenticated && (
        <div className="hidden md:flex items-center gap-3">
          <Link href={'/auth/login'} className="bg-transparent border-none text-[#0D0F14]/55 text-sm cursor-pointer px-4 py-2 rounded-lg hover:bg-[#0D0F14]/[0.06] hover:text-[#0D0F14] transition-all">
            Войти
          </Link>
          <Link href={'/auth/register'} className="bg-[#FF6B35] hover:bg-[#ff7a46] transition-colors border-none text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer shadow-[0_8px_24px_rgba(255,107,53,0.25)]">
            Начать бесплатно
          </Link>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-[#0D0F14]/60 hover:text-[#0D0F14] p-2"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#F8F7F4] border-t border-[#0D0F14]/08 md:hidden shadow-[0_8px_24px_rgba(0,0,0,0.07)]">
          <div className="flex flex-col gap-1 p-4">
            {NAV.map((item) => (
              <a
                key={item.value}
                href={item.value}
                className="text-[#0D0F14]/45 hover:text-[#0D0F14]/75 transition-colors py-3 px-4 rounded-lg hover:bg-[#0D0F14]/[0.05]"
              >
                {item.label}
              </a>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-4 border-t border-[#0D0F14]/08 mt-2">
                <Link href={'/auth/login'} className="text-[#0D0F14]/55 hover:text-[#0D0F14] hover:bg-[#0D0F14]/[0.06] w-full justify-start py-2 px-4 rounded-lg bg-transparent border-none cursor-pointer text-left">
                  Войти
                </Link>
                <Link href={'/auth/register'} className="bg-[#FF6B35] hover:bg-[#ff7a46] text-white font-semibold w-full py-2 px-4 rounded-lg border-none cursor-pointer">
                  Начать бесплатно
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
