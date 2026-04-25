'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Download, Search, ArrowLeft, Pencil, Trash2,
  Check, X, Package, AlertTriangle, XCircle,
} from 'lucide-react';
import { tablesApi, type Table } from '@/src/shared/api/tablesApi';
import { itemsApi, type Item } from '@/src/shared/api/itemApi';
import { filesApi } from '@/src/shared/api/fileApi';
import { authApi } from '@/src/shared/api';

function getStatus(qty: number): { label: string; cls: string } {
  if (qty === 0)  return { label: 'Нет',       cls: 'bg-red-500/10 text-red-500 border-red-500/25' };
  if (qty < 5)   return { label: 'Мало',       cls: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/25' };
  return           { label: 'В наличии', cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25' };
}

function StatusBadge({ qty }: { qty: number }) {
  const { label, cls } = getStatus(qty);
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border w-fit ${cls}`}>
      {label}
    </span>
  );
}

// ─── inline edit cell ─────────────────────────────────────────────────────────

function EditableCell({
  value,
  onSave,
  type = 'text',
  min,
}: {
  value: string | number;
  onSave: (v: string) => void;
  type?: string;
  min?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const commit = () => { setEditing(false); onSave(draft); };
  const cancel = () => { setEditing(false); setDraft(String(value)); };

  if (!editing) {
    return (
      <span
        onClick={() => setEditing(true)}
        className="cursor-pointer hover:text-[#FF6B35] transition-colors"
        title="Нажмите для редактирования"
      >
        {value}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <input
        ref={inputRef}
        type={type}
        min={min}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
        className="w-full max-w-[140px] border border-[#FF6B35]/60 rounded-md px-2 py-0.5 text-sm outline-none focus:ring-2 focus:ring-[#FF6B35]/30 bg-white text-[#0D0F14]"
      />
      <button onClick={commit}  className="text-emerald-500 hover:text-emerald-600"><Check size={14} /></button>
      <button onClick={cancel} className="text-[#0D0F14]/35 hover:text-[#0D0F14]/60"><X size={14} /></button>
    </span>
  );
}

interface AddModalProps {
  tableId: string;
  onClose: () => void;
  onAdded: (item: Item) => void;
}

function AddItemModal({ tableId, onClose, onAdded }: AddModalProps) {
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name.trim() ) {
      setError('Заполните название'); return;
    }
    setLoading(true);
    try {
      const item = await itemsApi.add({
        tableId,
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price) || 0,
        quantity: parseInt(form.quantity) || 0,
      });
      onAdded(item);
      onClose();
    } catch (e: any) {
      setError(e.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_32px_80px_rgba(0,0,0,0.18)] border border-[#0D0F14]/08 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0D0F14]/06 bg-[#F8F7F4]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FF6B35] flex items-center justify-center">
              <Plus size={14} className="text-white" />
            </div>
            <span className="font-bold text-[#0D0F14] text-sm">Новая позиция</span>
          </div>
          <button onClick={onClose} className="text-[#0D0F14]/35 hover:text-[#0D0F14]/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          {[
            { key: 'name',        label: 'Наименование',  placeholder: 'Наушники Sony WH-1000', type: 'text' },
            { key: 'description', label: 'Описание',       placeholder: 'Беспроводные, шумоподавление', type: 'text' },
            { key: 'price',       label: 'Цена (₽)',        placeholder: '4 990', type: 'number' },
            { key: 'quantity',    label: 'Остаток (шт.)',  placeholder: '24', type: 'number' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#0D0F14]/45 uppercase tracking-widest">
                {label}
              </label>
              <input
                type={type}
                min={type === 'number' ? 0 : undefined}
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={set(key as keyof typeof form)}
                className="border border-[#0D0F14]/12 rounded-xl px-4 py-2.5 text-sm text-[#0D0F14] placeholder:text-[#0D0F14]/25 outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#0D0F14]/12 rounded-xl py-2.5 text-sm text-[#0D0F14]/55 font-semibold hover:bg-[#0D0F14]/[0.04] transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-[#FF6B35] hover:bg-[#ff7a46] rounded-xl py-2.5 text-sm text-white font-bold transition-colors disabled:opacity-50 shadow-[0_8px_24px_rgba(255,107,53,0.25)]"
          >
            {loading ? 'Добавляем…' : 'Добавить'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export function TableDetailPage({ tableId }: { tableId: string }) {
  const router = useRouter();
  const [table,   setTable]   = useState<Table & { items?: Item[] } | null>(null);
  const [items,   setItems]   = useState<Item[]>([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [role,    setRole]    = useState<string>('USER');

  // load table + items
  useEffect(() => {
    const load = async () => {
      try {
        const [t, user] = await Promise.all([
          tablesApi.getById(tableId),
          authApi.getCurrentUser(),
        ]);
        setTable(t);
        setItems((t as any).items ?? []);
        setRole(user.role);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tableId]);

  const canEdit = role === 'ADMIN' || role === 'SUPERADMIN';

  // inline update helper
  const updateField = async (itemId: string, field: string, raw: string) => {
    const val = field === 'price'    ? parseFloat(raw) || 0
              : field === 'quantity' ? parseInt(raw)    || 0
              : raw;
    try {
      const updated = await itemsApi.update({ itemId, [field]: val });
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, ...updated } : i));
    } catch { /* ignore */ }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Удалить позицию?')) return;
    try {
      await itemsApi.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch { /* ignore */ }
  };

  const exportExcel = async () => {
    try {
      const blob = await filesApi.exportExcel(tableId);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${table?.name ?? 'export'}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
  };

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase()),
  );

  const totalQty   = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const outOf      = items.filter(i => i.quantity === 0).length;

  // ── loading / error states ─────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="w-8 h-8 border-[3px] border-[#FF6B35]/20 border-t-[#FF6B35] rounded-full animate-spin" />
    </div>
  );

  if (error || !table) return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center flex-col gap-4">
      <XCircle size={40} className="text-red-400" />
      <p className="text-[#0D0F14]/55 text-sm">{error ?? 'Таблица не найдена'}</p>
      <button onClick={() => router.push('/dashboard')} className="text-[#FF6B35] text-sm font-semibold hover:underline">
        ← Назад
      </button>
    </div>
  );

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F7F4]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-50"
        style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,0.10) 0%,transparent 70%)' }} />

      <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8">

        {/* ── breadcrumb ── */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-[#0D0F14]/40 hover:text-[#0D0F14]/70 transition-colors text-sm"
          >
            <ArrowLeft size={14} /> Все таблицы
          </button>
          <span className="text-[#0D0F14]/20">/</span>
          <span className="text-[#0D0F14]/70 text-sm font-semibold">{table.name}</span>
        </div>

        {/* ── stats bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Позиций',    value: items.length,                    icon: Package },
            { label: 'Ед. на складе', value: totalQty.toLocaleString('ru'), icon: null },
            { label: 'Стоимость',  value: `${totalPrice.toLocaleString('ru')} ₽`, icon: null },
            { label: 'Нет в наличии', value: outOf, icon: outOf > 0 ? AlertTriangle : null, accent: outOf > 0 },
          ].map(({ label, value, accent }) => (
            <div key={label} className="bg-white border border-[#0D0F14]/06 rounded-2xl px-5 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] font-semibold text-[#0D0F14]/35 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-2xl font-black ${accent ? 'text-red-500' : 'text-[#0D0F14]'}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── table card ── */}
        <div className="rounded-2xl overflow-hidden border border-[#0D0F14]/08 shadow-[0_8px_40px_rgba(0,0,0,0.07)] bg-white">

          {/* chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#0D0F14]/06 bg-[#0D0F14]/[0.015]">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-3 text-[11px] text-[#0D0F14]/35 font-mono truncate">
              📦 {table.name}
            </span>
          </div>

          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-[#0D0F14]/06 bg-[#0D0F14]/[0.008]">
            {/* search */}
            <div className="flex items-center gap-2 text-xs text-[#0D0F14]/35 bg-[#0D0F14]/[0.04] rounded-lg px-3 py-2 min-w-[200px] flex-1 max-w-[320px] border border-[#0D0F14]/08">
              <Search size={13} />
              <input
                type="text"
                placeholder="Поиск по наименованию…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none text-[#0D0F14]/70 placeholder:text-[#0D0F14]/30 text-sm flex-1"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              {canEdit && (
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1.5 text-xs text-[#FF6B35] bg-[#FF6B35]/10 border border-[#FF6B35]/25 rounded-lg px-3 py-2 cursor-pointer hover:bg-[#FF6B35]/20 transition-colors font-semibold"
                >
                  <Plus size={13} /> Добавить
                </button>
              )}
              <button
                onClick={exportExcel}
                className="flex items-center gap-1.5 text-xs text-[#0D0F14]/45 bg-[#0D0F14]/[0.04] border border-[#0D0F14]/08 rounded-lg px-3 py-2 cursor-pointer hover:bg-[#0D0F14]/[0.08] transition-colors font-semibold"
              >
                <Download size={13} /> Экспорт
              </button>
            </div>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">

              {/* head */}
              <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr_auto] px-4 py-2.5 border-b border-[#0D0F14]/06 bg-[#0D0F14]/[0.015]">
                {['Наименование', 'Описание', 'Цена', 'Остаток', 'Статус', ''].map((h, i) => (
                  <span key={i} className="text-[10px] font-semibold text-[#0D0F14]/30 uppercase tracking-widest">
                    {h}
                  </span>
                ))}
              </div>

              {/* rows */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-[#0D0F14]/30">
                  <Package size={32} />
                  <p className="text-sm">{search ? 'Ничего не найдено' : 'Нет позиций — добавьте первую'}</p>
                </div>
              ) : filtered.map((item) => (
                <div
                  key={item.id}
                  className="relative grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr_auto] px-4 py-3 border-b border-[#0D0F14]/[0.05] hover:bg-[#FF6B35]/[0.03] transition-colors duration-200 group items-center"
                >
                  {/* name */}
                  <span className="text-sm text-[#0D0F14]/85 font-medium truncate pr-4">
                    {canEdit
                      ? <EditableCell value={item.name} onSave={v => updateField(item.id, 'name', v)} />
                      : item.name}
                  </span>

                  {/* description */}
                  <span className="text-xs text-[#0D0F14]/45 truncate pr-4">
                    {canEdit
                      ? <EditableCell value={item.description} onSave={v => updateField(item.id, 'description', v)} />
                      : item.description}
                  </span>

                  {/* price */}
                  <span className="text-sm text-[#0D0F14]/70 font-mono">
                    {canEdit
                      ? <EditableCell value={item.price} type="number" min={0} onSave={v => updateField(item.id, 'price', v)} />
                      : `${item.price.toLocaleString('ru')} ₽`}
                  </span>

                  {/* quantity */}
                  <span className="text-sm text-[#0D0F14]/70 font-semibold">
                    {canEdit
                      ? <EditableCell value={item.quantity} type="number" min={0} onSave={v => updateField(item.id, 'quantity', v)} />
                      : item.quantity}
                  </span>

                  {/* status */}
                  <StatusBadge qty={item.quantity} />

                  {/* actions */}
                  <div className="absolute right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                    {canEdit && (
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-[#0D0F14]/25 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* footer */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#0D0F14]/06 bg-[#0D0F14]/[0.008]">
              <span className="text-xs text-[#0D0F14]/35">
                {filtered.length} из {items.length} позиций
              </span>
              <span className="text-xs font-semibold text-[#0D0F14]/50">
                Итого: <span className="text-[#FF6B35]">{totalPrice.toLocaleString('ru')} ₽</span>
              </span>
            </div>
          )}
        </div>

        {/* hint for inline edit */}
        {canEdit && items.length > 0 && (
          <p className="text-center text-[11px] text-[#0D0F14]/30 mt-4 flex items-center justify-center gap-1.5">
            <Pencil size={11} /> Нажмите на ячейку, чтобы изменить значение
          </p>
        )}
      </div>

      {/* add modal */}
      {showAdd && (
        <AddItemModal
          tableId={tableId}
          onClose={() => setShowAdd(false)}
          onAdded={item => setItems(prev => [...prev, item])}
        />
      )}
    </div>
  );
}