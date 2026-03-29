'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { authApi } from '@/src/shared/api';
import {
  AlertCircle, Package, ArrowLeft, Send,
  CheckCircle2, Eye, EyeOff, RefreshCw, XCircle, CheckCircle,
} from 'lucide-react';

type Step = 'email' | 'otp' | 'password' | 'done';

export const ForgotPassword = () => {
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Таймер повторной отправки
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // ── Шаг 1: отправить OTP ────────────────────────────────────────────

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Введите корректный email');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(email);
      setStep('otp');
      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setError('');
    try {
      await authApi.forgotPassword(email);
      setOtp(['', '', '', '', '', '']);
      setResendCooldown(60);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Шаг 2: проверить OTP ─────────────────────────────────────────────

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Введите 6-значный код'); return; }
    setIsLoading(true);
    setError('');
    try {
      const { resetToken: token } = await authApi.verifyOtp(email, code);
      setResetToken(token);
      setStep('password');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный код.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP поле — ввод по одной цифре
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Шаг 3: сменить пароль ────────────────────────────────────────────

  const getPasswordStrength = () => {
    if (!password) return null;
    const checks = {
      length: password.length >= 6,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    return { checks, strength: Object.values(checks).filter(Boolean).length };
  };
  const passwordStrength = getPasswordStrength();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError('Введите новый пароль'); return; }
    if (password.length < 6) { setError('Минимум 6 символов'); return; }
    if (!/[A-Z]/.test(password)) { setError('Нужна заглавная буква'); return; }
    if (!/[a-z]/.test(password)) { setError('Нужна строчная буква'); return; }
    if (!/[0-9]/.test(password)) { setError('Нужна цифра'); return; }
    if (password !== confirmPassword) { setError('Пароли не совпадают'); return; }

    setIsLoading(true);
    setError('');
    try {
      await authApi.resetPassword(resetToken, password);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка. Попробуйте начать заново.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Прогресс-бар ─────────────────────────────────────────────────────

  const stepIndex = { email: 0, otp: 1, password: 2, done: 3 }[step];
  const stepLabels = ['Email', 'Код из TG', 'Новый пароль'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7F4] via-[#F0EDE8] to-[#F8F7F4] flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-[700px] h-[700px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, rgba(255,107,53,0.15) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-[460px]">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.28)]">
            <Package size={22} className="text-white" />
          </div>
          <span className="text-[#0D0F14] font-black text-2xl tracking-tight">StockFlow</span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-8 border border-[#0D0F14]/05">

          {/* ── Прогресс (не на финальном шаге) ── */}
          {step !== 'done' && (
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-2">
                {stepLabels.map((label, i) => (
                  <div key={i} className="flex items-center gap-2 flex-1">
                    <div className={`flex items-center gap-1.5 ${i < stepIndex ? 'text-emerald-500' : i === stepIndex ? 'text-[#FF6B35]' : 'text-[#0D0F14]/25'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        i < stepIndex
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : i === stepIndex
                          ? 'border-[#FF6B35] text-[#FF6B35]'
                          : 'border-[#0D0F14]/15 text-[#0D0F14]/25'
                      }`}>
                        {i < stepIndex ? '✓' : i + 1}
                      </div>
                      <span className="text-[11px] font-semibold hidden sm:block">{label}</span>
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={`flex-1 h-0.5 rounded-full transition-all ${i < stepIndex ? 'bg-emerald-400' : 'bg-[#0D0F14]/10'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* ════════ ШАГ 1: Email ════════ */}
          {step === 'email' && (
            <>
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="flex items-center gap-1.5 text-sm text-[#0D0F14]/40 hover:text-[#0D0F14]/70 mb-6 -ml-1"
              >
                <ArrowLeft size={14} /> Назад
              </button>

              <div className="mb-7">
                <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center mb-4">
                  <Send size={20} className="text-[#FF6B35]" />
                </div>
                <h2 className="text-2xl font-bold text-[#0D0F14] mb-1.5">Забыли пароль?</h2>
                <p className="text-[#0D0F14]/50 text-sm leading-relaxed">
                  Введите email вашего аккаунта. Мы пришлём 6-значный код в привязанный Telegram.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D0F14]/70 block">Email адрес</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    disabled={isLoading}
                    className="h-11"
                    autoFocus
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-[#FF6B35] to-[#ff7a46] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(255,107,53,0.35)] transition-all hover:-translate-y-0.5">
                  {isLoading
                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Отправляем...</span>
                    : 'Получить код в Telegram'}
                </Button>
              </form>
            </>
          )}

          {/* ════════ ШАГ 2: OTP ════════ */}
          {step === 'otp' && (
            <>
              <div className="mb-7">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 text-2xl">
                  💬
                </div>
                <h2 className="text-2xl font-bold text-[#0D0F14] mb-1.5">Введите код</h2>
                <p className="text-[#0D0F14]/50 text-sm leading-relaxed">
                  Мы отправили 6-значный код в Telegram, привязанный к{' '}
                  <span className="font-semibold text-[#0D0F14]/70">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* OTP инпуты */}
                <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      disabled={isLoading}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                        ${digit ? 'border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]' : 'border-[#0D0F14]/15 text-[#0D0F14]'}
                        focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20`}
                    />
                  ))}
                </div>

                <Button type="submit" disabled={isLoading || otp.join('').length < 6}
                  className="w-full h-11 bg-gradient-to-r from-[#FF6B35] to-[#ff7a46] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(255,107,53,0.35)] disabled:opacity-50 transition-all hover:-translate-y-0.5">
                  {isLoading
                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Проверяем...</span>
                    : 'Подтвердить код'}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button type="button" onClick={() => { setStep('email'); setOtp(['','','','','','']); setError(''); }}
                    className="text-[#0D0F14]/40 hover:text-[#0D0F14]/70 flex items-center gap-1">
                    <ArrowLeft size={13} /> Изменить email
                  </button>
                  <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || isLoading}
                    className="text-[#FF6B35] font-semibold disabled:opacity-40 flex items-center gap-1.5">
                    <RefreshCw size={13} className={resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'} />
                    {resendCooldown > 0 ? `Повторить через ${resendCooldown}с` : 'Отправить снова'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ════════ ШАГ 3: Новый пароль ════════ */}
          {step === 'password' && (
            <>
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-[#0D0F14] mb-1.5">Новый пароль</h2>
                <p className="text-[#0D0F14]/50 text-sm">Придумайте надёжный пароль.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D0F14]/70 block">Новый пароль</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      className="h-11 pr-12"
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D0F14]/40">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  {password && passwordStrength && (
                    <div className="mt-2 p-3 bg-[#F8F7F4] rounded-lg space-y-2">
                      <div className="flex gap-1">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                            i <= passwordStrength.strength
                              ? passwordStrength.strength === 4 ? 'bg-emerald-500'
                                : passwordStrength.strength >= 3 ? 'bg-blue-500' : 'bg-yellow-500'
                              : 'bg-[#0D0F14]/10'
                          }`} />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {[
                          { key: 'length', label: '6+ символов' },
                          { key: 'upper', label: 'Заглавная' },
                          { key: 'lower', label: 'Строчная' },
                          { key: 'number', label: 'Цифра' },
                        ].map((c) => {
                          const ok = passwordStrength.checks[c.key as keyof typeof passwordStrength.checks];
                          return (
                            <div key={c.key} className="flex items-center gap-1.5">
                              {ok ? <CheckCircle size={11} className="text-emerald-500" /> : <XCircle size={11} className="text-[#0D0F14]/25" />}
                              <span className={ok ? 'text-emerald-600' : 'text-[#0D0F14]/40'}>{c.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0D0F14]/70 block">Подтвердите пароль</label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      className={`h-11 pr-12 ${
                        confirmPassword && confirmPassword !== password ? 'border-red-400'
                        : confirmPassword && confirmPassword === password ? 'border-emerald-400' : ''
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D0F14]/40">
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword === password && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle size={11} /> Пароли совпадают
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-[#FF6B35] to-[#ff7a46] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(255,107,53,0.35)] transition-all hover:-translate-y-0.5">
                  {isLoading
                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Сохраняем...</span>
                    : 'Сохранить новый пароль'}
                </Button>
              </form>
            </>
          )}

          {/* ════════ Готово ════════ */}
          {step === 'done' && (
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0D0F14] mb-2">Пароль изменён!</h2>
                <p className="text-[#0D0F14]/55 text-sm leading-relaxed">
                  Ваш пароль успешно обновлён. Войдите с новыми учётными данными.
                </p>
              </div>
              <Button onClick={() => router.push('/auth/login?passwordReset=1')}
                className="w-full h-11 bg-gradient-to-r from-[#FF6B35] to-[#ff7a46] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(255,107,53,0.35)]">
                Войти в систему
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};