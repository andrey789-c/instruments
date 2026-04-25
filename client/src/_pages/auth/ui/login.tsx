"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { authApi, ApiError } from "@/src/shared/api";
import { useFormValidation } from "@/src/shared/hooks/useValidationForm";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Package,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PhoneVerificationBlock } from "@/src/features/phone-verification/ui/PhoneVerificationBlock";

export const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = "/dashboard";
  const registered = searchParams.get("registered");
  const passwordReset = searchParams.get("passwordReset");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notIsVerified, setNotIsVerified] = useState(false);
  const [phone, setPhone] = useState("");

  const { errors, validate, clearError } = useFormValidation();

  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Введите корректный email";
        return null;
      },
    },
    password: {
      required: true,
      minLength: 1,
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate(formData, validationRules)) return;
    setIsLoading(true);
    try {
      await authApi.login({ ...formData, rememberMe });
      router.push(redirectTo);
    } catch (error) {
      const apiErr = error instanceof ApiError ? error : null;
      const errorMessage =
        apiErr?.message ||
        (error instanceof Error ? error.message : "Ошибка авторизации");

      setApiError(errorMessage);

      if (errorMessage === "Сначала подтвердите номер телефона через Telegram.") {
        setNotIsVerified(true);
        if (apiErr?.phone) {
          setPhone(apiErr.phone);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (notIsVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F7F4] via-[#F0EDE8] to-[#F8F7F4] flex items-center justify-center p-4">
        <div className="w-full max-w-[460px]">
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.28)]">
              <Package size={22} className="text-white" />
            </div>
            <span className="text-[#0D0F14] font-black text-2xl tracking-tight">StockFlow</span>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-8 border border-[#0D0F14]/05 space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[#229ED9]">
                <div className="w-6 h-6 rounded-full border-2 border-[#229ED9] flex items-center justify-center text-[#229ED9] text-xs font-bold">
                  1
                </div>
                <span className="text-xs font-semibold hidden sm:block">Telegram</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0D0F14] mb-1">Подтвердите номер</h2>
              <p className="text-sm text-[#0D0F14]/50">
                Для входа нужно подтвердить номер телефона через Telegram.
              </p>
            </div>

            <PhoneVerificationBlock
              initialPhone={phone}
              onVerified={() => {
                setNotIsVerified(false);
              }}
            />

            <p className="text-sm text-[#0D0F14]/45 text-center">
              После подтверждения вы сможете войти в аккаунт.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7F4] via-[#F0EDE8] to-[#F8F7F4] flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-[800px] h-[800px] pointer-events-none opacity-30 animate-pulse"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,107,53,0.15) 0%, transparent 70%)",
          animation: "float 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-20 animate-pulse"
        style={{
          background:
            "radial-gradient(ellipse, rgba(102,126,234,0.15) 0%, transparent 70%)",
          animation: "float 15s ease-in-out infinite reverse",
        }}
      />

      <div className="relative z-10 w-full max-w-[1100px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <div className="hidden lg:block space-y-8">
            <div className="flex items-center gap-3 mb-12 animate-slide-in-left">
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

            <div
              className="space-y-4 animate-slide-in-left"
              style={{ animationDelay: "0.1s" }}
            >
              <h1 className="text-5xl font-black text-[#0D0F14] leading-[1.1] tracking-tight">
                Добро пожаловать
                <br />
                <span className="text-[#FF6B35]">в StockFlow</span>
              </h1>
              <p className="text-lg text-[#0D0F14]/60 leading-relaxed max-w-md">
                Возвращайтесь к работе без лишних шагов: остатки, движение товара,
                команда — всё в одном месте.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { icon: "⚡", text: "Настройка за 5 минут" },
                { icon: "�", text: "Понятные таблицы без перегруза" },
                { icon: "🤝", text: "Удобная работа с командой" },
                { icon: "🔒", text: "Безопасное хранение данных" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 animate-slide-in-left"
                  style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#0D0F14]/08 flex items-center justify-center shadow-sm">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <span className="text-[#0D0F14]/70 font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <p
              className="text-sm text-[#0D0F14]/50 pt-6 animate-slide-in-left"
              style={{ animationDelay: "0.6s" }}
            >
              Нужно начать заново? Войдите и продолжайте с того места, где остановились.
            </p>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full animate-slide-in-right">
            <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
              <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.28)]">
                <Package size={24} className="text-white" />
              </div>
              <span className="text-[#0D0F14] font-black text-2xl tracking-tight">
                StockFlow
              </span>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.12)] p-8 lg:p-10 border border-[#0D0F14]/05">
              {/* Success: registered */}
              {registered && (
                <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">
                      Регистрация успешна!
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Войдите, используя свои учетные данные
                    </p>
                  </div>
                </div>
              )}

              {/* Success: password reset */}
              {passwordReset && (
                <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">
                      Пароль успешно изменён!
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Войдите с новым паролем
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#0D0F14] mb-2">
                  Вход в систему
                </h2>
                <p className="text-[#0D0F14]/50">
                  Рады видеть снова
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {apiError && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{apiError}</p>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-[#0D0F14]/70 block"
                  >
                    Email адрес
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`h-12 text-base ${errors.email ? "border-red-500 focus-visible:ring-red-500/20" : ""}`}
                    autoComplete="email"
                    autoFocus
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-[#0D0F14]/70"
                    >
                      Пароль
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push("/auth/forgot-password")}
                      className="text-xs text-[#FF6B35] hover:text-[#ff7a46] font-semibold transition-colors"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`h-12 text-base pr-12 ${errors.password ? "border-red-500 focus-visible:ring-red-500/20" : ""}`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D0F14]/40 hover:text-[#0D0F14]/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={rememberMe}
                    onClick={() => setRememberMe((prev) => !prev)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                      rememberMe
                        ? "bg-[#FF6B35] border-[#FF6B35]"
                        : "border-[#0D0F14]/25 hover:border-[#FF6B35]/50"
                    }`}
                  >
                    {rememberMe && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path
                          d="M1 4L4 7.5L10 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <label
                    onClick={() => setRememberMe((prev) => !prev)}
                    className="text-sm text-[#0D0F14]/60 cursor-pointer select-none"
                  >
                    Запомнить меня
                  </label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 bg-gradient-to-r from-[#FF6B35] to-[#ff7a46] hover:from-[#ff7a46] hover:to-[#ff8557] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(255,107,53,0.35)] text-base transition-all hover:shadow-[0_12px_32px_rgba(255,107,53,0.45)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Вход...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Войти
                      <ArrowRight size={18} />
                    </span>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#0D0F14]/08"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white text-[#0D0F14]/40">или</span>
                  </div>
                </div>

                {/* Register link */}
                <div className="text-center">
                  <p className="text-sm text-[#0D0F14]/60">
                    Нет аккаунта?{" "}
                    <button
                      type="button"
                      onClick={() => router.push("/auth/register")}
                      className="text-[#FF6B35] font-semibold hover:underline"
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                </div>
              </form>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#0D0F14]/40">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>SSL Защита</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>GDPR совместимо</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(30px, -30px) rotate(5deg);
          }
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
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
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
};
