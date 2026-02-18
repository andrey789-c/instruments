'use client'

import { Menu, Package, X } from "lucide-react";
import { useState } from "react";

const NAV = ["Возможности","Тарифы","FAQ"];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 lg:px-16 py-4 sm:py-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-[#FF6B35] flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.35)]">
          <Package size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
        </div>
        <span className="text-white font-black text-base sm:text-lg tracking-tight">StockFlow</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {NAV.map(item => (
          <a key={item} href="#" className="text-white/45 text-sm hover:text-white/75 transition-colors">{item}</a>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3">
        <button className="bg-transparent border-none text-white/55 text-sm cursor-pointer px-4 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white transition-all">
          Войти
        </button>
        <button className="bg-[#FF6B35] hover:bg-[#ff7a46] transition-colors border-none text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer shadow-[0_8px_24px_rgba(255,107,53,0.25)]">
          Начать бесплатно
        </button>
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white/70 hover:text-white p-2">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0f1117] border-t border-white/10 md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {NAV.map(item => (
              <a key={item} href="#" className="text-white/45 hover:text-white/75 transition-colors py-3 px-4 rounded-lg hover:bg-white/[0.05]">{item}</a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-2">
              <button className="text-white/55 hover:text-white hover:bg-white/[0.06] w-full justify-start py-2 px-4 rounded-lg bg-transparent border-none cursor-pointer text-left">
                Войти
              </button>
              <button className="bg-[#FF6B35] hover:bg-[#ff7a46] text-white font-semibold w-full py-2 px-4 rounded-lg border-none cursor-pointer">
                Начать бесплатно
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}