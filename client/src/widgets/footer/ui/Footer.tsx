"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authApi } from "@/src/shared/api";

export const Footer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
  }, []);

  return (
    <footer className="bg-[#F8F7F4] border-t border-[#0D0F14]/08 py-8 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Логотип */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#FF6B35] flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.28)]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M3 8h10M3 12h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[#0D0F14] font-black text-base tracking-tight">
              StockFlow
            </span>
          </div>

          {/* Ссылки */}
          <div className="flex items-center gap-6 text-sm">
            <a 
              href="#privacy" 
              className="text-[#0D0F14]/45 hover:text-[#0D0F14]/75 transition-colors"
            >
              Политика конфиденциальности
            </a>
            <span className="text-[#0D0F14]/20">•</span>
            <span className="text-[#0D0F14]/45">
              © 2025 StockFlow. Все права защищены.
            </span>
          </div>

          {!isAuthenticated && (
            <Link href="/auth/register" className="bg-[#FF6B35] hover:bg-[#ff7a46] transition-colors border-none text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer shadow-[0_8px_24px_rgba(255,107,53,0.25)]">
              Зарегистрироваться
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};