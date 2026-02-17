import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const NAV_LINKS = ["Возможности", "Тарифы", "FAQ"] as const;

export function Navbar() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-16 py-5">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] bg-[#FF6B35] flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.35)]">
          <Package size={18} className="text-white" />
        </div>
        <span className="text-white font-black text-lg tracking-tight">StockFlow</span>
      </div>

      {/* Links */}
      <div className="flex items-center gap-8">
        {NAV_LINKS.map((item) => (
          <a
            key={item}
            href="#"
            className="text-white/45 text-sm hover:text-white/75 transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          className="text-white/55 hover:text-white hover:bg-white/[0.06] text-sm"
        >
          Войти
        </Button>
        <Button className="bg-[#FF6B35] hover:bg-[#ff7a46] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-[0_8px_24px_rgba(255,107,53,0.25)]">
          Начать бесплатно
        </Button>
      </div>
    </nav>
  );
}