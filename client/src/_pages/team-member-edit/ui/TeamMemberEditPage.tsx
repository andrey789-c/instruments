'use client';

import { FormEvent, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { usersApi } from '@/src/shared/api/usersApi';

export function TeamMemberEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const userId = params?.id;
  const email = searchParams.get('email') ?? 'Пользователь';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const passwordError =
    password.length > 0 && password.length < 6 ? 'Минимум 6 символов' : '';
  const confirmError =
    confirmPassword.length > 0 && confirmPassword !== password ? 'Пароли не совпадают' : '';

  const canSubmit = Boolean(userId && password && confirmPassword && !passwordError && !confirmError);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !userId) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await usersApi.changePassword(userId, password);
      setSuccess('Пароль обновлён');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <header className="bg-white border-b border-[#0D0F14]/08 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => router.push('/team')}
            className="flex items-center gap-1.5 text-sm font-medium text-[#0D0F14]/50 hover:text-[#0D0F14] transition-colors"
          >
            <ArrowLeft size={16} /> Назад к участникам
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-[#0D0F14]/08 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center">
              <KeyRound size={18} className="text-[#FF6B35]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0D0F14] leading-none">Редактирование пользователя</h1>
              <p className="text-sm text-[#0D0F14]/45 mt-1 truncate">{email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                {success}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#0D0F14]/70">Новый пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className={`w-full h-11 px-4 pr-11 rounded-xl border text-sm outline-none transition-all ${
                    passwordError
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                      : 'border-[#0D0F14]/15 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0D0F14]/35 hover:text-[#0D0F14]/60"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#0D0F14]/70">Повторите пароль</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите новый пароль"
                  className={`w-full h-11 px-4 pr-11 rounded-xl border text-sm outline-none transition-all ${
                    confirmError
                      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                      : 'border-[#0D0F14]/15 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0D0F14]/35 hover:text-[#0D0F14]/60"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {confirmError && <p className="text-xs text-red-500">{confirmError}</p>}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => router.push('/team')}
                className="flex-1 h-11 rounded-xl border border-[#0D0F14]/15 text-sm font-medium text-[#0D0F14]/60 hover:bg-[#0D0F14]/05 transition-all"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="flex-1 h-11 rounded-xl bg-[#FF6B35] text-white text-sm font-semibold disabled:opacity-50 hover:bg-[#ff7a46] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,107,53,0.3)]"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
