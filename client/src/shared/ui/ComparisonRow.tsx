import { CheckCircle2, XCircle } from "lucide-react";

export interface IComparisonRow {
  feature: string
  us: string
  crm: string
}

export function ComparisonRow({ feature, us, crm }: IComparisonRow) {
  return (
    <div className="border-b border-[#0D0F14]/06 last:border-0 bg-white hover:bg-[#FF6B35]/[0.04] transition-colors duration-150">

      {/* Mobile */}
      <div className="sm:hidden px-4 py-3.5">
        <span className="text-[11px] font-semibold text-[#0D0F14]/35 uppercase tracking-widest block mb-2.5">
          {feature}
        </span>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-[13px] text-[#0D0F14] font-medium leading-snug">{us}</span>
          </div>
          <div className="flex items-start gap-1.5 pl-3 border-l border-[#0D0F14]/06">
            <XCircle size={15} className="text-[#0D0F14]/25 shrink-0 mt-0.5" />
            <span className="text-[13px] text-[#0D0F14]/40 leading-snug">{crm}</span>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:grid sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="px-5 py-4 flex items-center">
          <span className="text-sm font-semibold text-[#0D0F14]/70">{feature}</span>
        </div>
        <div className="px-5 py-4 flex items-start gap-2">
          <CheckCircle2 size={17} className="text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-sm text-[#0D0F14] font-medium leading-snug">{us}</span>
        </div>
        <div className="px-5 py-4 flex items-start gap-2">
          <XCircle size={17} className="text-[#0D0F14]/25 shrink-0 mt-0.5" />
          <span className="text-sm text-[#0D0F14]/40 leading-snug">{crm}</span>
        </div>
      </div>

    </div>
  );
}