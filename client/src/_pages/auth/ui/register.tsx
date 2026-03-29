'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { authApi } from '@/src/shared/api';
import { useFormValidation } from '@/src/shared/hooks/useValidationForm';
import { PhoneVerificationBlock } from '@/src/features/phone-verification/ui/PhoneVerificationBlock';
import {
  AlertCircle, Eye, EyeOff, Package, ArrowRight, CheckCircle, Building2,
} from 'lucide-react';

interface RegisterFormData {
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

// Шаги регистрации
type RegStep = 'form' | 'verify-phone' | 'done';

export const Register = () => {
  const router = useRouter();
  const [step, setStep] = useState<RegStep>('form');
  const [formData, setFormData] = useState<Record<string, string>>({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [isLoading, setIsLoading]           = useState(false);
  const [apiError, setApiError]             = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneVerified, setPhoneVerified]   = useState(false);

  const { errors, validate, clearError } = useFormValidation();

  const validationRules = {
    organizationName: { required: true, minLength: 2, maxLength: 100 },
    email: {
      required: true,
      custom: (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Введите корректный email'),
    },
    password: {
      required: true,
      minLength: 6,
      custom: (v: string) => {
        if (v.length < 6) return 'Минимум 6 символов';
        if (!/[A-Z]/.test(v)) return 'Нужна заглавная буква';
        if (!/[a-z]/.test(v)) return 'Нужна строчная буква';
        if (!/[0-9]/.test(v)) return 'Нужна цифра';
        return null;
      },
    },
    confirmPassword: {
      required: true,
      custom: (v: string) => (v !== formData.password ? 'Пароли не совпадают' : null),
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError(name);
    setApiError('');
  };

  // ── Шаг 1: Валидация → создаём аккаунт → идём к верификации телефона
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate(formData, validationRules)) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      // @ts-ignore
      await authApi.register(registerData);

      if (formData.phone && formData.phone.replace(/\D/g, '').length >= 10) {
        // Есть номер — идём к шагу верификации
        setStep('verify-phone');
      } else {
        // Без телефона — сразу на логин
        router.push('/auth/login?registered=true');
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Шаг 2: Пропустить верификацию
  const handleSkipPhone = () => {
    router.push('/auth/login?registered=true');
  };

  // ── Шаг 2: Телефон подтверждён
  const handlePhoneVerified = () => {
    setPhoneVerified(true);
    setTimeout(() => router.push('/auth/login?registered=true'), 1800);
  };

  // ── Password strength helper
  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    const checks = {
      length: p.length >= 6,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
    };
    return { checks, strength: Object.values(checks).filter(Boolean).length };
  };
  const ps = getPasswordStrength();

  // ════════════════════════════════════════════════════════════════
  // ШАГ 2 — Верификация телефона
  // ════════════════════════════════════════════════════════════════
  if (step === 'verify-phone') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F7F4] via-[#F0EDE8] to-[#F8F7F4] flex items-center justify-center p-4">
        <div className="w-full max-w-[460px]">
          {/* Logo */}
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.28)]">
              <Package size={22} className="text-white" />
            </div>
            <span className="text-[#0D0F14] font-black text-2xl tracking-tight">StockFlow</span>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-8 border border-[#0D0F14]/05 space-y-6">

            {/* Прогресс */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-emerald-500">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
                <span className="text-xs font-semibold hidden sm:block">Аккаунт</span>
              </div>
              <div className="flex-1 h-0.5 rounded-full bg-emerald-400" />
              <div className="flex items-center gap-1.5 text-[#229ED9]">
                <div className="w-6 h-6 rounded-full border-2 border-[#229ED9] flex items-center justify-center text-[#229ED9] text-xs font-bold">2</div>
                <span className="text-xs font-semibold hidden sm:block">Telegram</span>
              </div>
            </div>

            {/* Заголовок */}
            <div>
              <h2 className="text-2xl font-bold text-[#0D0F14] mb-1">Подтвердите номер</h2>
              <p className="text-sm text-[#0D0F14]/50">
                Это позволит получать уведомления и сбрасывать пароль через Telegram.
              </p>
            </div>

            <PhoneVerificationBlock
              initialPhone={formData.phone}
              onVerified={handlePhoneVerified}
            />

            {phoneVerified && (
              <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-sm text-emerald-700 font-medium">Отлично! Перенаправляем вас...</p>
              </div>
            )}

            {!phoneVerified && (
              <button
                type="button"
                onClick={handleSkipPhone}
                className="text-sm text-[#0D0F14]/40 hover:text-[#0D0F14]/60 transition-colors w-full text-center"
              >
                Пропустить — подтвержу позже
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7F4] via-[#F0EDE8] to-[#F8F7F4] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none opacity-25"
        style={{ background: 'radial-gradient(ellipse, rgba(102,126,234,0.2) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-[1100px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Форма (левая колонка) ── */}
          <div className="w-full order-2 lg:order-1">
            <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
              <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.28)]">
                <Package size={24} className="text-white" />
              </div>
              <span className="text-[#0D0F14] font-black text-2xl tracking-tight">StockFlow</span>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-8 lg:p-10 border border-[#0D0F14]/05">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#0D0F14] mb-2">Создать аккаунт</h2>
                <p className="text-[#0D0F14]/50">Начните работу бесплатно</p>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-5">
                {apiError && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{apiError}</p>
                  </div>
                )}

                {/* Organization */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0D0F14]/70 flex items-center gap-2">
                    <Building2 size={16} /> Название организации
                  </label>
                  <Input
                    name="organizationName" type="text" placeholder="ООО Ромашка"
                    value={formData.organizationName} onChange={handleChange}
                    disabled={isLoading} autoFocus
                    className={`h-12 ${errors.organizationName ? 'border-red-500' : ''}`}
                  />
                  {errors.organizationName && <p className="text-xs text-red-500">{errors.organizationName}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0D0F14]/70">Email адрес</label>
                  <Input
                    name="email" type="email" placeholder="you@company.com"
                    value={formData.email} onChange={handleChange}
                    disabled={isLoading}
                    className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0D0F14]/70">Пароль</label>
                  <div className="relative">
                    <Input
                      name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      value={formData.password} onChange={handleChange}
                      disabled={isLoading}
                      className={`h-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D0F14]/40">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  {formData.password && ps && (
                    <div className="mt-2 p-3 bg-[#F8F7F4] rounded-lg space-y-2">
                      <div className="flex gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${i <= ps.strength ? (ps.strength === 4 ? 'bg-emerald-500' : ps.strength >= 3 ? 'bg-blue-500' : 'bg-yellow-500') : 'bg-[#0D0F14]/10'}`} />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[['length','6+ символов'],['upper','Заглавная'],['lower','Строчная'],['number','Цифра']].map(([k, l]) => (
                          <div key={k} className="flex items-center gap-1.5">
                            {ps.checks[k as keyof typeof ps.checks]
                              ? <CheckCircle size={12} className="text-emerald-500" />
                              : <div className="w-3 h-3 rounded-full border-2 border-[#0D0F14]/20" />}
                            <span className={ps.checks[k as keyof typeof ps.checks] ? 'text-emerald-600' : 'text-[#0D0F14]/40'}>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0D0F14]/70">Подтвердите пароль</label>
                  <div className="relative">
                    <Input
                      name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••"
                      value={formData.confirmPassword} onChange={handleChange}
                      disabled={isLoading}
                      className={`h-12 pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D0F14]/40">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>

                {/* Phone (опциональный) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0D0F14]/70 flex items-center gap-2">
                    Номер телефона
                    <span className="text-[#0D0F14]/30 font-normal text-xs">— необязательно</span>
                  </label>
                  <Input
                    name="phone" type="tel" placeholder="+7 900 000 00 00"
                    value={formData.phone} onChange={handleChange}
                    disabled={isLoading}
                    className="h-12"
                  />
                  <p className="text-xs text-[#0D0F14]/40">
                    Для подтверждения аккаунта через Telegram и восстановления пароля
                  </p>
                </div>

                <Button type="submit" disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#FF6B35] to-[#ff7a46] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(255,107,53,0.35)] hover:-translate-y-0.5 transition-all">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Создание аккаунта...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Создать аккаунт <ArrowRight size={18} />
                    </span>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-[#0D0F14]/60">
                    Уже есть аккаунт?{' '}
                    <button type="button" onClick={() => router.push('/auth/login')}
                      className="text-[#FF6B35] font-semibold hover:underline">
                      Войти
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* ── Правая колонка (преимущества) ── */}
          <div className="hidden lg:block space-y-8 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-14 h-14 rounded-[12px] bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_8px_32px_rgba(255,107,53,0.35)]">
                <Package size={28} className="text-white" />
              </div>
              <div>
                <span className="text-[#0D0F14] font-black text-2xl tracking-tight block">StockFlow</span>
                <span className="text-[#0D0F14]/40 text-sm">Учёт инвентаря</span>
              </div>
            </div>
            <h2 className="text-4xl font-black text-[#0D0F14] leading-tight">
              Начните работу<br /><span className="text-[#FF6B35]">бесплатно</span>
            </h2>
            <div className="space-y-4 pt-4">
              {[
                { title: '14 дней бесплатно', desc: 'Полный доступ ко всем функциям' },
                { title: 'Без кредитной карты', desc: 'Не требуется оплата для старта' },
                { title: 'Поддержка 24/7', desc: 'Готовы помочь в любое время' },
                { title: 'Безопасность данных', desc: 'SSL шифрование и резервное копирование' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-[#0D0F14]/08 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B35]/10 to-[#FF6B35]/5 border border-[#FF6B35]/20 flex items-center justify-center shrink-0">
                    <CheckCircle size={20} className="text-[#FF6B35]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0D0F14]">{item.title}</div>
                    <div className="text-sm text-[#0D0F14]/50">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};