'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/src/shared/api';
import { usersApi, type Member } from '@/src/shared/api/usersApi';
import {
  Package, ArrowLeft, Trash2, Loader2, Shield,
  User, Crown, ChevronDown, Eye, EyeOff, X, Check,
  AlertCircle, Phone, Mail, Calendar, ShieldCheck,
  ShieldAlert, UserPlus, Users,
} from 'lucide-react';

// ── helpers ─────────────────────────────────────────────────────────────

const ROLE_META = {
  SUPERADMIN: { label: 'Владелец', icon: Crown, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  ADMIN:      { label: 'Администратор', icon: Shield, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  USER:       { label: 'Сотрудник', icon: User, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
};

function RoleBadge({ role }: { role: keyof typeof ROLE_META }) {
  const m = ROLE_META[role] ?? ROLE_META.USER;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${m.color} ${m.bg} ${m.border}`}>
      <m.icon size={11} />
      {m.label}
    </span>
  );
}

function formatPhone(phone: string | null) {
  if (!phone) return '—';
  const d = phone.replace(/\D/g, '');
  if (d.length === 11) return `+${d[0]} (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7,9)}-${d.slice(9,11)}`;
  return phone;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Add member drawer ────────────────────────────────────────────────────

interface AddDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdded: (m: Member) => void;
}

function AddMemberDrawer({ open, onClose, onAdded }: AddDrawerProps) {
  const [form, setForm] = useState({ email: '', password: '', phone: '', role: 'USER' as 'USER' | 'ADMIN' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const reset = () => {
    setForm({ email: '', password: '', phone: '', role: 'USER' });
    setError('');
    setTouched({});
    setShowPw(false);
  };

  const close = () => { reset(); onClose(); };

  const handleChange = (k: keyof typeof form, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    setTouched(p => ({ ...p, [k]: true }));
    setError('');
  };

  const emailErr  = touched.email    && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Некорректный email' : '';
  const pwErr     = touched.password && form.password.length < 6 ? 'Минимум 6 символов' : '';
  const phoneErr  = touched.phone    && form.phone.replace(/\D/g, '').length < 10 ? 'Введите корректный номер' : '';

  const canSubmit = form.email && form.password && form.phone && !emailErr && !pwErr && !phoneErr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true, phone: true });
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const rawPhone = form.phone.replace(/\D/g, '');
      const member = await usersApi.createMember({ ...form, phone: rawPhone });
      onAdded(member);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />

      {/* drawer */}
      <div className="relative ml-auto w-full max-w-[440px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto animate-slide-in-right">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0D0F14]/08 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center">
              <UserPlus size={17} className="text-[#FF6B35]" />
            </div>
            <div>
              <h2 className="font-bold text-[#0D0F14] text-base leading-none">Добавить участника</h2>
              <p className="text-xs text-[#0D0F14]/40 mt-0.5">Новый сотрудник организации</p>
            </div>
          </div>
          <button onClick={close} className="w-8 h-8 rounded-lg hover:bg-[#0D0F14]/08 flex items-center justify-center transition-colors">
            <X size={16} className="text-[#0D0F14]/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 py-6 gap-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#0D0F14]/70">Роль</label>
            <div className="grid grid-cols-2 gap-2">
              {(['USER', 'ADMIN'] as const).map(r => {
                const m = ROLE_META[r];
                const active = form.role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleChange('role', r)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                      active
                        ? `${m.border} ${m.bg} ${m.color}`
                        : 'border-[#0D0F14]/10 text-[#0D0F14]/50 hover:border-[#0D0F14]/20'
                    }`}
                  >
                    <m.icon size={16} />
                    <div>
                      <div className="text-xs font-bold">{m.label}</div>
                      <div className="text-[10px] opacity-60 mt-0.5">
                        {r === 'ADMIN' ? 'Управление' : 'Просмотр'}
                      </div>
                    </div>
                    {active && <Check size={14} className="ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#0D0F14]/70">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0D0F14]/30" />
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="employee@company.com"
                className={`w-full h-11 pl-9 pr-4 rounded-xl border text-sm outline-none transition-all ${
                  emailErr ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-[#0D0F14]/15 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15'
                }`}
              />
            </div>
            {emailErr && <p className="text-xs text-red-500">{emailErr}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#0D0F14]/70">Номер телефона</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0D0F14]/30" />
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="+7 900 000 00 00"
                className={`w-full h-11 pl-9 pr-4 rounded-xl border text-sm outline-none transition-all ${
                  phoneErr ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-[#0D0F14]/15 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15'
                }`}
              />
            </div>
            {phoneErr && <p className="text-xs text-red-500">{phoneErr}</p>}
            <p className="text-xs text-[#0D0F14]/35">Участнику нужно будет подтвердить номер через Telegram</p>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#0D0F14]/70">Временный пароль</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                placeholder="Минимум 6 символов"
                className={`w-full h-11 px-4 pr-11 rounded-xl border text-sm outline-none transition-all ${
                  pwErr ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-[#0D0F14]/15 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15'
                }`}
              />
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0D0F14]/35 hover:text-[#0D0F14]/60">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {pwErr && <p className="text-xs text-red-500">{pwErr}</p>}
          </div>

          <div className="mt-auto pt-4 flex gap-2">
            <button type="button" onClick={close}
              className="flex-1 h-11 rounded-xl border border-[#0D0F14]/15 text-sm font-medium text-[#0D0F14]/60 hover:bg-[#0D0F14]/05 transition-all">
              Отмена
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 h-11 rounded-xl bg-[#FF6B35] text-white text-sm font-semibold disabled:opacity-50 hover:bg-[#ff7a46] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,107,53,0.3)]">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
              Добавить
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.25s ease-out; }
      `}</style>
    </div>
  );
}

// ── Delete confirm ───────────────────────────────────────────────────────

interface DeleteModalProps {
  member: Member | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteModal({ member, onConfirm, onCancel, loading }: DeleteModalProps) {
  if (!member) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-[#0D0F14]/08">
        <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-[#0D0F14] mb-1">Удалить участника?</h3>
        <p className="text-sm text-[#0D0F14]/50 mb-1">
          Аккаунт <span className="font-semibold text-[#0D0F14]/80">{member.email}</span> будет безвозвратно удалён.
        </p>
        <p className="text-xs text-[#0D0F14]/35 mb-5">Все данные участника будут утеряны.</p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-[#0D0F14]/15 text-sm font-medium text-[#0D0F14]/60 hover:bg-[#0D0F14]/05 transition-all">
            Отмена
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold disabled:opacity-50 hover:bg-red-600 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Role selector dropdown ───────────────────────────────────────────────

function RoleDropdown({ member, onChange }: { member: Member; onChange: (id: string, role: string) => void }) {
  const [open, setOpen] = useState(false);
  if (member.role === 'SUPERADMIN') return <RoleBadge role="SUPERADMIN" />;

  const options = [
    { value: 'USER',  label: 'Сотрудник' },
    { value: 'ADMIN', label: 'Администратор' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1"
      >
        <RoleBadge role={member.role} />
        <ChevronDown size={13} className={`text-[#0D0F14]/35 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 left-0 z-20 bg-white rounded-xl border border-[#0D0F14]/10 shadow-xl overflow-hidden w-44">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(member.id, opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm hover:bg-[#0D0F14]/05 transition-colors ${
                  member.role === opt.value ? 'font-semibold text-[#FF6B35]' : 'text-[#0D0F14]/70'
                }`}
              >
                {member.role === opt.value && <Check size={13} className="text-[#FF6B35]" />}
                {member.role !== opt.value && <span className="w-[13px]" />}
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────

export function TeamPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<{ id: string; role: string; organizationName: string } | null>(null);
  const [members, setMembers]     = useState<Member[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showAdd, setShowAdd]     = useState(false);
  const [toDelete, setToDelete]   = useState<Member | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [roleChanging, setRoleChanging] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [me, list] = await Promise.all([authApi.getCurrentUser(), usersApi.list()]);
      if (me.role !== 'SUPERADMIN') { router.replace('/dashboard'); return; }
      setCurrentUser(me as any);
      setMembers(list);
    } catch {
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const handleAdded = (m: Member) => setMembers(p => [...p, m]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await usersApi.deleteMember(toDelete.id);
      setMembers(p => p.filter(m => m.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления');
    } finally {
      setDeleting(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    setRoleChanging(userId);
    try {
      const updated = await usersApi.changeRole(userId, role);
      setMembers(p => p.map(m => m.id === userId ? { ...m, role: updated.role } : m));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка изменения роли');
    } finally {
      setRoleChanging(null);
    }
  };

  const owner   = members.find(m => m.role === 'SUPERADMIN');
  const rest    = members.filter(m => m.role !== 'SUPERADMIN');
  const admins  = rest.filter(m => m.role === 'ADMIN');
  const users   = rest.filter(m => m.role === 'USER');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <header className="bg-white border-b border-[#0D0F14]/08 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-sm font-medium text-[#0D0F14]/50 hover:text-[#0D0F14] transition-colors">
            <ArrowLeft size={16} /> Дашборд
          </button>
          <div className="h-4 w-px bg-[#0D0F14]/10" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_2px_8px_rgba(255,107,53,0.3)]">
              <Package size={15} className="text-white" />
            </div>
            <span className="font-black text-[#0D0F14] text-base tracking-tight">StockFlow</span>
          </div>
          <div className="ml-auto">
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-xl font-semibold text-sm shadow-[0_4px_14px_rgba(255,107,53,0.3)] hover:bg-[#ff7a46] hover:-translate-y-0.5 transition-all">
              <UserPlus size={15} /> Добавить участника
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Page title ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center">
              <Users size={18} className="text-[#FF6B35]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0D0F14] leading-none">Участники</h1>
              <p className="text-sm text-[#0D0F14]/40 mt-0.5">{currentUser?.organizationName}</p>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 gap-3 mb-8 lg:grid-cols-3">
          {[
            { label: 'Всего', value: members.length, color: 'text-[#0D0F14]' },
            { label: 'Администраторов', value: admins.length, color: 'text-violet-600' },
            { label: 'Сотрудников', value: users.length, color: 'text-sky-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#0D0F14]/08 px-5 py-4 shadow-sm">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#0D0F14]/40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-6">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* ── Members list ── */}
        <div className="space-y-2">
          {members.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center mb-3">
                <Users size={24} className="text-[#FF6B35]" />
              </div>
              <p className="font-bold text-[#0D0F14] mb-1">Участников пока нет</p>
              <p className="text-sm text-[#0D0F14]/40">Добавьте первого сотрудника</p>
            </div>
          )}

          {members.map(m => {
            const isMe = m.id === currentUser?.id;
            const isOwner = m.role === 'SUPERADMIN';
            return (
              <div key={m.id}
                className="bg-white rounded-2xl border border-[#0D0F14]/08 hover:border-[#0D0F14]/15 transition-all shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">

                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-base
                    ${isOwner ? 'bg-amber-50 border border-amber-200 text-amber-600'
                    : m.role === 'ADMIN' ? 'bg-violet-50 border border-violet-200 text-violet-600'
                    : 'bg-sky-50 border border-sky-200 text-sky-600'}`}>
                    {m.email[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#0D0F14] text-sm truncate">{m.email}</span>
                      {isMe && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20">
                          Вы
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-[#0D0F14]/40 flex items-center gap-1">
                        <Phone size={10} /> {formatPhone(m.phone)}
                      </span>
                      <span className="text-xs text-[#0D0F14]/40 flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(m.createdAt)}
                      </span>
                      <span className={`text-xs flex items-center gap-1 ${m.phoneVerified ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {m.phoneVerified
                          ? <><ShieldCheck size={10} /> Telegram подтверждён</>
                          : <><ShieldAlert size={10} /> Не подтверждён</>
                        }
                      </span>
                    </div>
                  </div>

                  {/* Role + actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    {roleChanging === m.id
                      ? <Loader2 size={14} className="animate-spin text-[#0D0F14]/40" />
                      : <RoleDropdown member={m} onChange={handleRoleChange} />
                    }
                    <Link
                      href={`/team/${m.id}/edit?email=${encodeURIComponent(m.email)}`}
                      className="h-8 px-3 rounded-lg border border-[#0D0F14]/12 text-xs font-semibold text-[#0D0F14]/55 hover:text-[#FF6B35] hover:border-[#FF6B35]/30 hover:bg-[#FF6B35]/5 transition-all flex items-center"
                      title="Редактировать участника"
                    >
                      Редактировать
                    </Link>
                    {!isMe && !isOwner && (
                      <button
                        onClick={() => setToDelete(m)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0D0F14]/25 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Удалить участника"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <AddMemberDrawer open={showAdd} onClose={() => setShowAdd(false)} onAdded={handleAdded} />
      <DeleteModal member={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} loading={deleting} />
    </div>
  );
}