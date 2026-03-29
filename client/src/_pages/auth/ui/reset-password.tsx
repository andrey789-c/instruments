'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { authApi } from '@/src/shared/api';
import { AlertCircle, Package, Eye, EyeOff, CheckCircle, CheckCircle2, XCircle } from 'lucide-react';

export const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace('/auth/forgot-password');
    }
  }, [token, router]);

  const getPasswordStrength = () => {
    if (!password) return null;
    const checks = {
      length: password.length >= 6,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    const passed = Object.values(checks).filter(Boolean).length;
    return { checks, strength: passed };
  };

  const passwordStrength = getPasswordStrength();

  const validate = () => {
    if (!password) return 'Введите новый пароль';
    if (password.length < 6) return 'Минимум 6 символов';
    if (!/[A-Z]/.test(password)) return 'Пароль должен содержать заглавную букву';
    if (!/[a-z]/.test(password)) return 'Пароль должен содержать строчную букву';
    if (!/[0-9]/.test(password)) return 'Пароль должен содержать цифру';
    if (!confirmPassword) return 'Подтвердите пароль';
    if (password !== confirmPassword) return 'Пароли не совпадают';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    if (!token) return;

    setIsLoading(true);
    setError('');

    try {
      await authApi.resetPassword(token, password);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка. Попробуйте запросить новую ссылку.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7F4] via-[#F0EDE8] to-[#F8F7F4] flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, rgba(255,107,53,0.2) 0%, transparent 70%)' }}
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

          {isSuccess ? (
            // ── Успех ──────────────────────────────────────────────────
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0D0F14] mb-2">Пароль изменён</h2>
                <p className="text-[#0D0F14]/55 text-sm leading-relaxed">
                  Ваш пароль успешно обновлён. Теперь вы можете войти с новым паролем.
                </p>
              </div>
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full h-11 bg-gradient-to-r from-[#FF6B35] to-[#ff7a46] hover:from-[#ff7a46] hover:to-[#ff8557] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(255,107,53,0.35)]"
              >
                Войти в систему
              </Button>
            </div>
          ) : (
            // ── Форма ──────────────────────────────────────────────────
            <>
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-[#0D0F14] mb-1.5">Новый пароль</h2>
                <p className="text-[#0D0F14]/50 text-sm">Придумайте надёжный пароль для вашего аккаунта.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-600">{error}</p>
                      {(error.includes('истёк') || error.includes('недействительна')) && (
                        <button
                          type="button"
                          onClick={() => router.push('/auth/forgot-password')}
                          className="text-xs text-red-500 underline mt-1"
                        >
                          Запросить новую ссылку
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* New password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-[#0D0F14]/70 block">
                    Новый пароль
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      disabled={isLoading}
                      className="h-11 pr-12"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D0F14]/40 hover:text-[#0D0F14]/60"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  {/* Password strength */}
                  {password && passwordStrength && (
                    <div className="mt-2 p-3 bg-[#F8F7F4] rounded-lg space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              i <= passwordStrength.strength
                                ? passwordStrength.strength === 4
                                  ? 'bg-emerald-500'
                                  : passwordStrength.strength >= 3
                                  ? 'bg-blue-500'
                                  : 'bg-yellow-500'
                                : 'bg-[#0D0F14]/10'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {[
                          { key: 'length', label: '6+ символов' },
                          { key: 'upper', label: 'Заглавная' },
                          { key: 'lower', label: 'Строчная' },
                          { key: 'number', label: 'Цифра' },
                        ].map((check) => {
                          const passed = passwordStrength.checks[check.key as keyof typeof passwordStrength.checks];
                          return (
                            <div key={check.key} className="flex items-center gap-1.5">
                              {passed
                                ? <CheckCircle size={11} className="text-emerald-500 shrink-0" />
                                : <XCircle size={11} className="text-[#0D0F14]/25 shrink-0" />
                              }
                              <span className={passed ? 'text-emerald-600' : 'text-[#0D0F14]/40'}>
                                {check.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#0D0F14]/70 block">
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      disabled={isLoading}
                      className={`h-11 pr-12 ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-red-400'
                          : confirmPassword && confirmPassword === password
                          ? 'border-emerald-400'
                          : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D0F14]/40 hover:text-[#0D0F14]/60"
                    >
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword === password && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle size={11} /> Пароли совпадают
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-[#FF6B35] to-[#ff7a46] hover:from-[#ff7a46] hover:to-[#ff8557] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(255,107,53,0.35)] transition-all hover:shadow-[0_12px_32px_rgba(255,107,53,0.45)] hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Сохраняем...
                    </span>
                  ) : (
                    'Сохранить новый пароль'
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};