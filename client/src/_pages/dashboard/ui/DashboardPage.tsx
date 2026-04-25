'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, tablesApi } from '@/src/shared/api';
import type { User } from '@/src/shared/api/authApi';
import type { Table } from '@/src/shared/api/tablesApi';
import {
  Package, Plus, LogOut, ChevronRight, Loader2,
  Layers, TrendingUp, Users, Trash2, Edit3, Check, X,
} from 'lucide-react';

interface TableWithItems {
  items?: { price: number }[];
}

export function DashboardPage() {
  const router = useRouter();

  const [user, setUser]       = useState<User | null>(null);
  const [tables, setTables]   = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Create table modal
  const [showCreate, setShowCreate]     = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [creating, setCreating]         = useState(false);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting]     = useState(false);

  // Rename
  const [renamingId, setRenamingId]   = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renaming, setRenaming]       = useState(false);

  const canEdit = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const isSuperadmin = user?.role === 'SUPERADMIN';

  const load = useCallback(async () => {
    try {
      const [me, all] = await Promise.all([
        authApi.getCurrentUser(),
        tablesApi.getAll(),
      ]);

      // Keep dashboard totals in sync with table detail page:
      // derive sum from actual items when backend returns them.
      const enriched = await Promise.all(
        all.map(async (table) => {
          try {
            const detailed = await tablesApi.getById(table.id) as TableWithItems;
            const computedTotal = (detailed.items ?? []).reduce((sum, item) => sum + item.price, 0);
            return { ...table, totalPrice: computedTotal };
          } catch {
            return table;
          }
        })
      );

      setUser(me);
      setTables(enriched);
    } catch {
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/auth/login');
  };

  const handleCreate = async () => {
    if (!newTableName.trim()) return;
    setCreating(true);
    try {
      const t = await tablesApi.create({ name: newTableName.trim() });
      setTables(prev => [t, ...prev]);
      setNewTableName('');
      setShowCreate(false);
    } catch { /* ignore */ } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await tablesApi.delete(id);
      setTables(prev => prev.filter(t => t.id !== id));
      setDeletingId(null);
    } catch { /* ignore */ } finally {
      setDeleting(false);
    }
  };

  const handleRename = async () => {
    if (!renamingId || !renameValue.trim()) return;
    setRenaming(true);
    try {
      const updated = await tablesApi.update({ tableId: renamingId, name: renameValue.trim() });
      setTables(prev => prev.map(t => t.id === renamingId ? { ...t, name: updated.name } : t));
      setRenamingId(null);
    } catch { /* ignore */ } finally {
      setRenaming(false);
    }
  };

  const totalValue = tables.reduce((s, t) => s + (t.totalPrice ?? 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#0D0F14]/08 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_4px_12px_rgba(255,107,53,0.3)]">
              <Package size={17} className="text-white" />
            </div>
            <span className="font-black text-[#0D0F14] text-lg tracking-tight">StockFlow</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Team link — only for superadmin */}
            {isSuperadmin && (
              <button
                onClick={() => router.push('/team')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#0D0F14]/55 hover:text-[#0D0F14] hover:bg-[#0D0F14]/05 transition-all text-sm font-medium"
              >
                <Users size={15} />
                Участники
              </button>
            )}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-[#0D0F14] leading-none">{user?.organizationName}</span>
              <span className="text-xs text-[#0D0F14]/40 mt-0.5">{user?.email}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FF6B35]/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
              <span className="text-[11px] font-semibold text-[#FF6B35] uppercase tracking-wide">{user?.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#0D0F14]/50 hover:text-[#0D0F14] hover:bg-[#0D0F14]/05 transition-all text-sm font-medium"
            >
              <LogOut size={15} />
              <span className="hidden sm:block">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* ── Stats ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Layers, label: 'Таблицы', value: String(tables.length),
              color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200',
            },
            {
              icon: TrendingUp, label: 'Общая стоимость', value: `${totalValue.toLocaleString('ru')} ₽`,
              color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
            },
            {
              icon: Users, label: 'Роль', value: user?.role ?? '',
              color: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/10', border: 'border-[#FF6B35]/20',
              // Clicking on role stat goes to team page for superadmin
              onClick: isSuperadmin ? () => router.push('/team') : undefined,
            },
          ].map((s, i) => (
            <div
              key={i}
              onClick={s.onClick}
              className={`bg-white rounded-2xl border border-[#0D0F14]/08 p-5 flex items-center gap-4 shadow-sm ${
                s.onClick ? 'cursor-pointer hover:border-[#FF6B35]/30 hover:shadow-[0_4px_16px_rgba(255,107,53,0.1)] transition-all' : ''
              }`}
            >
              <div className={`w-11 h-11 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center shrink-0`}>
                <s.icon size={20} className={s.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[#0D0F14]/40 mb-0.5">{s.label}</div>
                <div className="text-lg font-bold text-[#0D0F14] truncate">{s.value}</div>
              </div>
              {s.onClick && <ChevronRight size={15} className="text-[#0D0F14]/25 shrink-0" />}
            </div>
          ))}
        </div>

        {/* ── Team banner (superadmin only) ──────────────────────── */}
        {isSuperadmin && (
          <button
            onClick={() => router.push('/team')}
            className="w-full mb-6 flex items-center justify-between gap-4 px-5 py-4 bg-white rounded-2xl border border-[#0D0F14]/08 hover:border-[#FF6B35]/30 hover:shadow-[0_4px_16px_rgba(255,107,53,0.1)] transition-all text-left shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35]/15 to-[#FF6B35]/05 border border-[#FF6B35]/20 flex items-center justify-center">
                <Users size={18} className="text-[#FF6B35]" />
              </div>
              <div>
                <div className="font-semibold text-[#0D0F14] text-sm">Управление участниками</div>
                <div className="text-xs text-[#0D0F14]/40">Добавляйте сотрудников и настраивайте их роли</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#0D0F14]/25 group-hover:text-[#FF6B35] transition-colors shrink-0" />
          </button>
        )}

        {/* ── Tables header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D0F14]">Мои таблицы</h1>
          {canEdit && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-xl font-semibold text-sm shadow-[0_4px_14px_rgba(255,107,53,0.3)] hover:bg-[#ff7a46] hover:-translate-y-0.5 transition-all"
            >
              <Plus size={16} /> Новая таблица
            </button>
          )}
        </div>

        {/* ── Error ─────────────────────────────────────────────── */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-5">{error}</div>
        )}

        {/* ── Create modal ──────────────────────────────────────── */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-[#0D0F14]/08">
              <h3 className="text-lg font-bold text-[#0D0F14] mb-4">Новая таблица</h3>
              <input
                type="text"
                placeholder="Название таблицы..."
                value={newTableName}
                onChange={e => setNewTableName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-[#0D0F14]/15 text-sm text-[#0D0F14] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowCreate(false); setNewTableName(''); }}
                  className="flex-1 py-2.5 rounded-xl border border-[#0D0F14]/15 text-sm font-medium text-[#0D0F14]/60 hover:bg-[#0D0F14]/05 transition-all"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !newTableName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF6B35] text-white text-sm font-semibold disabled:opacity-50 hover:bg-[#ff7a46] transition-all flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 size={14} className="animate-spin" /> : null}
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tables grid ───────────────────────────────────────── */}
        {tables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center mb-4">
              <Layers size={28} className="text-[#FF6B35]" />
            </div>
            <p className="text-lg font-bold text-[#0D0F14] mb-1">Таблиц пока нет</p>
            <p className="text-sm text-[#0D0F14]/40">
              {canEdit ? 'Создайте первую таблицу, чтобы начать' : 'Администратор ещё не создал таблицы'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map(table => (
              <div key={table.id} className="group bg-white rounded-2xl border border-[#0D0F14]/08 hover:border-[#FF6B35]/30 hover:shadow-[0_8px_32px_rgba(255,107,53,0.12)] transition-all duration-200 overflow-hidden">

                <div
                  className="p-5 cursor-pointer"
                  onClick={() => {
                    if (renamingId === table.id || deletingId === table.id) return;
                    router.push(`/dashboard/${table.id}`);
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center shrink-0">
                      <Layers size={18} className="text-[#FF6B35]" />
                    </div>
                    <ChevronRight size={16} className="text-[#0D0F14]/25 group-hover:text-[#FF6B35] mt-1 transition-colors" />
                  </div>

                  {renamingId === table.id ? (
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenamingId(null); }}
                        autoFocus
                        className="flex-1 px-2 py-1 text-sm border border-[#FF6B35] rounded-lg outline-none text-[#0D0F14] min-w-0"
                      />
                      <button onClick={handleRename} disabled={renaming}
                        className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shrink-0">
                        {renaming ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                      </button>
                      <button onClick={() => setRenamingId(null)}
                        className="w-7 h-7 rounded-lg bg-[#0D0F14]/08 text-[#0D0F14]/60 flex items-center justify-center hover:bg-[#0D0F14]/15 transition-colors shrink-0">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-bold text-[#0D0F14] text-[15px] leading-snug mb-1 truncate">{table.name}</h3>
                  )}

                  <p className="text-xs text-[#0D0F14]/40 mt-2">
                    Сумма: <span className="font-semibold text-[#0D0F14]/70">{(table.totalPrice ?? 0).toLocaleString('ru')} ₽</span>
                  </p>
                </div>

                {canEdit && (
                  <div className="flex gap-px border-t border-[#0D0F14]/06">
                    <button
                      onClick={e => { e.stopPropagation(); setRenamingId(table.id); setRenameValue(table.name); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-[#0D0F14]/40 hover:text-[#FF6B35] hover:bg-[#FF6B35]/05 transition-all"
                    >
                      <Edit3 size={13} /> Переименовать
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setDeletingId(table.id); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-[#0D0F14]/40 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={13} /> Удалить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Delete confirm modal ───────────────────────────────── */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-[#0D0F14]/08">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0F14] mb-1">Удалить таблицу?</h3>
            <p className="text-sm text-[#0D0F14]/50 mb-5">
              Все данные таблицы «{tables.find(t => t.id === deletingId)?.name}» будут удалены безвозвратно.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#0D0F14]/15 text-sm font-medium text-[#0D0F14]/60 hover:bg-[#0D0F14]/05 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold disabled:opacity-50 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : null}
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}