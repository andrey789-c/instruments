'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { authApi } from '@/src/shared/api';
import { useFormValidation } from '@/src/shared/hooks/useValidationForm';
import { AlertCircle, Eye, EyeOff, Package, ArrowRight, CheckCircle, Building2 } from 'lucide-react';

interface RegisterFormData {
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { errors, validate, clearError } = useFormValidation();

  const validationRules = {
    organizationName: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Введите корректный email';
        }
        return null;
      },
    },
    password: {
      required: true,
      minLength: 6,
      custom: (value: string) => {
        if (value.length < 6) {
          return 'Минимум 6 символов';
        }
        if (!/[A-Z]/.test(value)) {
          return 'Должна быть заглавная буква';
        }
        if (!/[a-z]/.test(value)) {
          return 'Должна быть строчная буква';
        }
        if (!/[0-9]/.test(value)) {
          return 'Должна быть цифра';
        }
        return null;
      },
    },
    confirmPassword: {
      required: true,
      custom: (value: string) => {
        if (value !== formData.password) {
          return 'Пароли не совпадают';
        }
        return null;
      },
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validate(formData, validationRules)) {
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;

      // @ts-ignore
      await authApi.register(registerData);
      router.push('/auth/login?registered=true');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7F4] via-[#F0EDE8] to-[#F8F7F4] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none opacity-25 animate-pulse"
        style={{
          background: 'radial-gradient(ellipse, rgba(102,126,234,0.2) 0%, transparent 70%)',
          animation: 'float 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none opacity-20 animate-pulse"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,107,53,0.15) 0%, transparent 70%)',
          animation: 'float 22s ease-in-out infinite reverse',
        }}
      />

      <div className="relative z-10 w-full max-w-[1100px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Form */}
          <div className="w-full order-2 lg:order-1 animate-slide-in-left">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
              <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.28)]">
                <Package size={24} className="text-white" />
              </div>
              <span className="text-[#0D0F14] font-black text-2xl tracking-tight">
                StockFlow
              </span>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-8 lg:p-10 border border-[#0D0F14]/05">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#0D0F14] mb-2">Создать аккаунт</h2>
                <p className="text-[#0D0F14]/50">Начните работу бесплатно</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {apiError && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{apiError}</p>
                  </div>
                )}

                {/* Organization Name */}
                <div className="space-y-2">
                  <label htmlFor="organizationName" className="text-sm font-semibold text-[#0D0F14]/70 flex items-center gap-2">
                    <Building2 size={16} />
                    Название организации
                  </label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    placeholder="ООО Ромашка"
                    value={formData.organizationName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`h-12 ${errors.organizationName ? 'border-red-500' : ''}`}
                    autoFocus
                  />
                  {errors.organizationName && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.organizationName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#0D0F14]/70">
                    Email адрес
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-[#0D0F14]/70">
                    Пароль
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`h-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D0F14]/40 hover:text-[#0D0F14]/60"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.password}
                    </p>
                  )}

                  {/* Password strength */}
                  {formData.password && passwordStrength && (
                    <div className="mt-3 p-3 bg-[#F8F7F4] rounded-lg space-y-2">
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
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { key: 'length', label: '6+ символов' },
                          { key: 'upper', label: 'Заглавная' },
                          { key: 'lower', label: 'Строчная' },
                          { key: 'number', label: 'Цифра' },
                        ].map((check) => (
                          <div key={check.key} className="flex items-center gap-1.5">
                            {passwordStrength.checks[check.key as keyof typeof passwordStrength.checks] ? (
                              <CheckCircle size={12} className="text-emerald-500" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border-2 border-[#0D0F14]/20" />
                            )}
                            <span className={passwordStrength.checks[check.key as keyof typeof passwordStrength.checks] ? 'text-emerald-600' : 'text-[#0D0F14]/40'}>
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#0D0F14]/70">
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`h-12 pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D0F14]/40 hover:text-[#0D0F14]/60"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 bg-gradient-to-r from-[#FF6B35] to-[#ff7a46] hover:from-[#ff7a46] hover:to-[#ff8557] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(255,107,53,0.35)] transition-all hover:shadow-[0_12px_32px_rgba(255,107,53,0.45)] hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Создание аккаунта...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Создать аккаунт
                      <ArrowRight size={18} />
                    </span>
                  )}
                </Button>

                {/* Terms */}
                <p className="text-xs text-[#0D0F14]/40 text-center">
                  Создавая аккаунт, вы соглашаетесь с{' '}
                  <a href="#" className="text-[#FF6B35] hover:underline">
                    условиями использования
                  </a>{' '}
                  и{' '}
                  <a href="#" className="text-[#FF6B35] hover:underline">
                    политикой конфиденциальности
                  </a>
                </p>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#0D0F14]/08"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white text-[#0D0F14]/40">или</span>
                  </div>
                </div>

                {/* Login link */}
                <div className="text-center">
                  <p className="text-sm text-[#0D0F14]/60">
                    Уже есть аккаунт?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/auth/login')}
                      className="text-[#FF6B35] font-semibold hover:underline"
                    >
                      Войти
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right - Features */}
          <div className="hidden lg:block space-y-8 order-1 lg:order-2 animate-slide-in-right">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-14 h-14 rounded-[12px] bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_8px_32px_rgba(255,107,53,0.35)]">
                <Package size={28} className="text-white" />
              </div>
              <div>
                <span className="text-[#0D0F14] font-black text-2xl tracking-tight block">
                  StockFlow
                </span>
                <span className="text-[#0D0F14]/40 text-sm">
                  Учёт инвентаря
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black text-[#0D0F14] leading-tight">
                Начните работу
                <br />
                <span className="text-[#FF6B35]">бесплатно</span>
              </h2>
              <p className="text-lg text-[#0D0F14]/60 leading-relaxed">
                Присоединяйтесь к тысячам компаний, которые уже управляют своим складом с StockFlow
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 pt-4">
              {[
                { title: '14 дней бесплатно', desc: 'Полный доступ ко всем функциям' },
                { title: 'Без кредитной карты', desc: 'Не требуется оплата для старта' },
                { title: 'Поддержка 24/7', desc: 'Готовы помочь в любое время' },
                { title: 'Безопасность данных', desc: 'SSL шифрование и резервное копирование' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-[#0D0F14]/08 shadow-sm hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B35]/10 to-[#FF6B35]/5 border border-[#FF6B35]/20 flex items-center justify-center flex-shrink-0">
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -30px) rotate(5deg); }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}