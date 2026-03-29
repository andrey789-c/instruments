'use client'

import { useForgotPassword } from "../model/useForgotPassword";

const TelegramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.28l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.958.279z" />
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="28" viewBox="0 0 40 48" fill="none" className="text-amber-400">
    <rect x="4" y="20" width="32" height="24" rx="4" fill="currentColor" opacity=".15" />
    <rect x="4" y="20" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
    <path d="M12 20v-6a8 8 0 1 1 16 0v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="20" cy="32" r="3" fill="currentColor" />
    <line x1="20" y1="35" x2="20" y2="39" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function SuccessView({ email, onReset }: { email: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 mb-2">
        <TelegramIcon size={24} />
      </div>

      <h2 className="text-2xl font-serif text-stone-100 tracking-tight">
        Ссылка отправлена!
      </h2>
      <p className="text-sm text-stone-400 leading-relaxed max-w-[260px]">
        Ссылка для сброса пароля отправлена в{" "}
        <span className="text-sky-400 font-medium">Telegram</span> — на аккаунт,
        привязанный к <strong className="text-stone-200">{email}</strong>
      </p>

      {/* Steps */}
      <div className="w-full mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-3">
        {[
          "Откройте Telegram",
          "Найдите сообщение от бота",
          "Нажмите кнопку «Сбросить пароль»",
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-stone-400">
            <span className="min-w-[22px] h-[22px] rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            {step}
          </div>
        ))}
      </div>

      <p className="text-xs text-stone-500 mt-1">⏱ Ссылка действует 15 минут</p>

      <button
        onClick={onReset}
        className="mt-3 text-sm text-stone-400 underline underline-offset-4 hover:text-stone-200 transition-colors cursor-pointer bg-transparent border-none"
      >
        Попробовать другой email
      </button>
    </div>
  );
}

// ── Main Form ───────────────────────────────────────────────────────────────
export function ForgotPasswordForm() {
  const { state, setEmail, submit, reset } = useForgotPassword();
  const { email, status, errorMsg } = state;

  const isLoading = status === "loading";

  if (status === "telegram_sent") {
    return (
      <div className="relative w-full max-w-sm rounded-2xl bg-[#14171f] border border-white/[0.08] px-10 py-10 shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_60px_-20px_rgba(232,168,56,0.18)]">
        <SuccessView email={email} onReset={reset} />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm rounded-2xl bg-[#14171f] border border-white/[0.08] px-10 py-10 flex flex-col items-center shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_60px_-20px_rgba(232,168,56,0.18)]">

      {/* Lock icon */}
      <div className="w-12 h-12 rounded-[13px] bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mb-6">
        <LockIcon />
      </div>

      <h1 className="font-serif text-[1.65rem] font-normal text-stone-100 tracking-tight mb-2 text-center">
        Забыли пароль?
      </h1>
      <p className="text-sm text-stone-400 text-center leading-relaxed mb-7 max-w-[260px]">
        Введите email — мы отправим ссылку для сброса прямо в{" "}
        <span className="inline-flex items-center gap-1 text-sky-400 font-medium">
          <TelegramIcon size={14} /> Telegram
        </span>
      </p>

      {/* Field */}
      <div className="w-full flex flex-col gap-1.5 mb-5">
        <label htmlFor="fpf-email" className="text-[11px] font-medium uppercase tracking-widest text-stone-500">
          Email
        </label>
        <input
          id="fpf-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          disabled={isLoading}
          autoComplete="email"
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className={[
            "w-full px-4 py-3 rounded-xl text-sm text-stone-100 placeholder:text-stone-600",
            "bg-white/[0.04] border outline-none transition-all duration-200",
            "caret-amber-400 disabled:opacity-50",
            errorMsg
              ? "border-red-500 focus:border-red-500"
              : "border-white/[0.08] focus:border-amber-400 focus:shadow-[0_0_0_3px_rgba(232,168,56,0.18)]",
          ].join(" ")}
        />
        {errorMsg && (
          <span className="text-xs text-red-400">{errorMsg}</span>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={submit}
        disabled={isLoading || !email}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-400 text-[#0d0f14] text-sm font-medium transition-all duration-200 shadow-[0_4px_18px_rgba(232,168,56,0.22)] hover:opacity-90 hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
      >
        {isLoading ? (
          <span className="w-[18px] h-[18px] rounded-full border-2 border-black/20 border-t-[#0d0f14] animate-spin" />
        ) : (
          <>
            <TelegramIcon size={16} />
            Отправить в Telegram
          </>
        )}
      </button>

      <a href="/auth" className="mt-5 text-xs text-stone-500 hover:text-stone-300 transition-colors">
        ← Вернуться ко входу
      </a>
    </div>
  );
}