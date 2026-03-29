// client/src/features/phone-verification/ui/PhoneVerificationBlock.tsx

'use client';

import { useState, useEffect } from 'react';
import { usePhoneVerification } from '../model/usePhoneVerification';
import { CheckCircle2, ExternalLink, RefreshCw, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';

interface PhoneVerificationBlockProps {
  /** Номер телефона, заполненный в форме регистрации */
  initialPhone?: string;
  /** Вызывается когда верификация успешно завершена */
  onVerified?: () => void;
  /** Компактный режим для страницы профиля */
  compact?: boolean;
}

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function PhoneVerificationBlock({
  initialPhone = '',
  onVerified,
  compact = false,
}: PhoneVerificationBlockProps) {
  const [phone, setPhone] = useState(initialPhone);
  const { state, telegramUrl, secondsLeft, start, reset } = usePhoneVerification();

  // Если пришёл initialPhone — автоматически подставляем
  useEffect(() => {
    if (initialPhone) setPhone(initialPhone);
  }, [initialPhone]);

  // Уведомляем родителя об успехе
  useEffect(() => {
    if (state === 'verified') onVerified?.();
  }, [state, onVerified]);

  // ── Успех ─────────────────────────────────────────────────────────────
  if (state === 'verified') {
    return (
      <div className={`flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 ${compact ? '' : 'w-full'}`}>
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-700">Номер подтверждён!</p>
          <p className="text-xs text-emerald-600">{phone}</p>
        </div>
      </div>
    );
  }

  // ── Ожидание подтверждения в Telegram ─────────────────────────────────
  if (state === 'waiting' && telegramUrl) {
    return (
      <div className={`${compact ? '' : 'w-full'} space-y-3`}>
        {/* Инструкция */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-500 text-sm shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="text-sm font-semibold text-sky-800">Откройте бота StockFlow</p>
              <p className="text-xs text-sky-600 mt-0.5">Нажмите кнопку ниже — откроется Telegram</p>
            </div>
          </div>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#229ED9] text-white font-semibold text-sm transition-opacity hover:opacity-90 no-underline"
          >
            <TelegramIcon />
            Открыть Telegram
            <ExternalLink size={14} className="opacity-70" />
          </a>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-500 text-sm shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="text-sm font-semibold text-sky-800">Поделитесь номером</p>
              <p className="text-xs text-sky-600 mt-0.5">Бот попросит нажать кнопку «Поделиться номером»</p>
            </div>
          </div>
        </div>

        {/* Статус polling */}
        <div className="flex items-center justify-between text-xs text-[#0D0F14]/40 px-1">
          <span className="flex items-center gap-1.5">
            <Loader2 size={11} className="animate-spin" />
            Ожидаем подтверждения...
          </span>
          <span>
            {state === 'waiting' && `${formatSeconds(secondsLeft)}`}
          </span>
        </div>

        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 text-xs text-[#0D0F14]/40 hover:text-[#0D0F14]/70 transition-colors"
        >
          <RefreshCw size={11} /> Изменить номер
        </button>
      </div>
    );
  }

  // ── Истекло или ошибка ────────────────────────────────────────────────
  if (state === 'expired' || state === 'error') {
    return (
      <div className={`${compact ? '' : 'w-full'} space-y-3`}>
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-600 font-medium">
              {state === 'expired' ? 'Время истекло (15 мин)' : 'Ошибка соединения'}
            </p>
            <p className="text-xs text-red-500 mt-0.5">
              {state === 'expired' ? 'Попробуйте ещё раз' : 'Проверьте соединение и попробуйте снова'}
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={reset} className="w-full">
          <RefreshCw size={14} /> Попробовать снова
        </Button>
      </div>
    );
  }

  // ── Исходное состояние — форма ввода номера ───────────────────────────
  return (
    <div className={`${compact ? '' : 'w-full'} space-y-2`}>
      <label className="text-sm font-semibold text-[#0D0F14]/70 flex items-center gap-2">
        <Phone size={15} />
        Номер телефона
        <span className="text-[#0D0F14]/30 font-normal text-xs">(для подтверждения через Telegram)</span>
      </label>

      <div className="flex gap-2">
        <Input
          type="tel"
          placeholder="+7 900 000 00 00"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          disabled={state === 'generating'}
          className="h-11 flex-1"
        />
        <Button
          type="button"
          onClick={() => start(phone)}
          disabled={state === 'generating' || phone.replace(/\D/g, '').length < 10}
          className="h-11 px-4 bg-[#229ED9] hover:bg-[#1a8bbf] text-white shrink-0"
        >
          {state === 'generating' ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <TelegramIcon size={16} />
              Подтвердить
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-[#0D0F14]/40 leading-relaxed">
        Мы откроем Telegram-бот, где вы нажмёте кнопку «Поделиться номером» — так мы убедимся, что номер ваш.
      </p>
    </div>
  );
}

// ── Иконка Telegram ────────────────────────────────────────────────────────

function TelegramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.28l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.958.279z" />
    </svg>
  );
}