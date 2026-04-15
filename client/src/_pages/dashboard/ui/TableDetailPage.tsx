'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, tablesApi, itemsApi } from '@/src/shared/api';
import type { User } from '@/src/shared/api/authApi';
import type { Item } from '@/src/shared/api/itemApi';
import {
  Package, ArrowLeft, Plus, Trash2, Loader2, Check, X,
  ChevronUp, ChevronDown, Search, Download,
} from 'lucide-react';

interface TableDetail {
  id: string;
  name: string;
  ownerId: string;
  totalPrice: number;
  items: Item[];
}

interface Props {
  tableId: string;
}

interface EditingCell {
  itemId: string;
  field: 'name' | 'description' | 'price';
}

export function TableDetailPage({ tableId }: Props) {
  const router = useRouter();

  const [user, setUser]       = useState<User | null>(null);
  const [table, setTable]     = useState<TableDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');
  const [sortField, setSortField] = useState<'name' | 'price' | null>(null);
  const [sortDir, setSortDir]     = useState<'asc' | 'desc'>('asc');

  // Inline editing
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue]     = useState('');
  const [saving, setSaving]           = useState(false);

  // Add row
  const [showAddRow, setShowAddRow] = useState(false);
  const [newRow, setNewRow]         = useState({ name: '', description: '', price: '' });
  const [addingRow, setAddingRow]   = useState(false);

  // Delete row
  const [deletingRowId, setDeletingRowId] = useState<string | null>(null);

  const editInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const canEdit = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  const load = useCallback(async () => {
    try {
      const [me, t] = await Promise.all([
        authApi.getCurrentUser(),
        tablesApi.getById(tableId),
      ]);
      setUser(me);
      setTable(t as unknown as TableDetail);
    } catch {
      setError('Не удалось загрузить таблицу');
    } finally {
      setLoading(false);
    }
  }, [tableId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCell]);

  // ── Sorting & filtering ─────────────────────────────────────
  const filteredItems = (table?.items ?? [])
    .filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const va = sortField === 'price' ? a.price : a.name.toLowerCase();
      const vb = sortField === 'price' ? b.price : b.name.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSort = (field: 'name' | 'price') => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // ── Inline edit ─────────────────────────────────────────────
  const startEdit = (item: Item, field: 'name' | 'description' | 'price') => {
    if (!canEdit) return;
    setEditingCell({ itemId: item.id, field });
    setEditValue(field === 'price' ? String(item.price) : (item[field] as string));
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const commitEdit = async () => {
    if (!editingCell || !table) return;
    setSaving(true);
    try {
      const update: Record<string, string | number> = {};
      if (editingCell.field === 'price') {
        const num = parseFloat(editValue);
        if (isNaN(num) || num < 0) { cancelEdit(); return; }
        update.price = num;
      } else {
        if (!editValue.trim()) { cancelEdit(); return; }
        update[editingCell.field] = editValue.trim();
      }
      const updated = await itemsApi.update({ itemId: editingCell.itemId, ...update });
      setTable(prev => prev ? {
        ...prev,
        items: prev.items.map(i => i.id === updated.id ? updated : i),
        totalPrice: prev.items.map(i => i.id === updated.id ? updated : i).reduce((s, i) => s + i.price, 0),
      } : prev);
      setEditingCell(null);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
    if (e.key === 'Escape') cancelEdit();
  };

  // ── Add row ─────────────────────────────────────────────────
  const handleAddRow = async () => {
    if (!newRow.name.trim() || !newRow.description.trim()) return;
    const price = parseFloat(newRow.price);
    if (isNaN(price) || price < 0) return;
    setAddingRow(true);
    try {
      const item = await itemsApi.add({ tableId, name: newRow.name.trim(), description: newRow.description.trim(), price });
      setTable(prev => prev ? {
        ...prev,
        items: [...prev.items, item],
        totalPrice: prev.totalPrice + item.price,
      } : prev);
      setNewRow({ name: '', description: '', price: '' });
      setShowAddRow(false);
    } catch { /* ignore */ } finally {
      setAddingRow(false);
    }
  };

  // ── Delete row ──────────────────────────────────────────────
  const handleDeleteRow = async (id: string) => {
    setDeletingRowId(id);
    try {
      await itemsApi.delete(id);
      setTable(prev => {
        if (!prev) return prev;
        const items = prev.items.filter(i => i.id !== id);
        return { ...prev, items, totalPrice: items.reduce((s, i) => s + i.price, 0) };
      });
    } catch { /* ignore */ } finally {
      setDeletingRowId(null);
    }
  };

  // ── Export CSV ──────────────────────────────────────────────
  const exportCsv = () => {
    if (!table) return;
    const rows = [['Название', 'Описание', 'Цена (₽)'], ...table.items.map(i => [i.name, i.description, String(i.price)])];
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${table.name}.csv`;
    a.click();
  };

  // ── Render ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  const SortIcon = ({ field }: { field: 'name' | 'price' }) => {
    if (sortField !== field) return <ChevronUp size={13} className="text-[#0D0F14]/20" />;
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-[#FF6B35]" />
      : <ChevronDown size={13} className="text-[#FF6B35]" />;
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#0D0F14]/08 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-9 h-9 rounded-lg bg-[#0D0F14]/05 hover:bg-[#0D0F14]/10 flex items-center justify-center transition-colors shrink-0"
            >
              <ArrowLeft size={16} className="text-[#0D0F14]" />
            </button>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#ff7a46] flex items-center justify-center shadow-[0_4px_12px_rgba(255,107,53,0.3)] shrink-0">
              <Package size={17} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-[#0D0F14] text-base leading-none truncate">{table?.name ?? '—'}</h1>
              <span className="text-xs text-[#0D0F14]/40">{table?.items.length ?? 0} позиций</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              {(table?.totalPrice ?? 0).toLocaleString('ru')} ₽
            </span>
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#0D0F14]/50 hover:text-[#0D0F14] hover:bg-[#0D0F14]/05 transition-all text-sm font-medium"
            >
              <Download size={15} />
              <span className="hidden sm:block">CSV</span>
            </button>
            {canEdit && (
              <button
                onClick={() => setShowAddRow(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-xl font-semibold text-sm shadow-[0_4px_14px_rgba(255,107,53,0.3)] hover:bg-[#ff7a46] hover:-translate-y-0.5 transition-all"
              >
                <Plus size={15} /> Добавить
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-5">{error}</div>
        )}

        {/* ── Search bar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0D0F14]/30" />
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#0D0F14]/10 rounded-xl outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 text-[#0D0F14] placeholder:text-[#0D0F14]/30"
            />
          </div>
          <span className="text-xs text-[#0D0F14]/40 shrink-0">
            {filteredItems.length} из {table?.items.length ?? 0}
          </span>
        </div>

        {/* ── Table ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#0D0F14]/08 shadow-sm overflow-hidden">

          {/* Table header */}
          <div className="grid gap-px bg-[#F8F7F4] border-b border-[#0D0F14]/08" style={{ gridTemplateColumns: canEdit ? '2fr 3fr 1fr 44px' : '2fr 3fr 1fr' }}>
            <div
              className="px-4 py-3 flex items-center gap-1.5 cursor-pointer hover:text-[#FF6B35] transition-colors text-xs font-semibold text-[#0D0F14]/50 uppercase tracking-widest"
              onClick={() => toggleSort('name')}
            >
              Название <SortIcon field="name" />
            </div>
            <div className="px-4 py-3 text-xs font-semibold text-[#0D0F14]/50 uppercase tracking-widest">
              Описание
            </div>
            <div
              className="px-4 py-3 flex items-center gap-1.5 cursor-pointer hover:text-[#FF6B35] transition-colors text-xs font-semibold text-[#0D0F14]/50 uppercase tracking-widest"
              onClick={() => toggleSort('price')}
            >
              Цена <SortIcon field="price" />
            </div>
            {canEdit && <div className="px-2 py-3" />}
          </div>

          {/* Rows */}
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[#0D0F14]/30 text-sm">
                {search ? 'Ничего не найдено' : 'В таблице пока нет позиций'}
              </p>
              {!search && canEdit && (
                <button
                  onClick={() => setShowAddRow(true)}
                  className="mt-3 text-sm text-[#FF6B35] font-semibold hover:underline"
                >
                  Добавить первую позицию
                </button>
              )}
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className={`grid gap-px border-b border-[#0D0F14]/05 last:border-0 group transition-colors ${
                  deletingRowId === item.id ? 'opacity-50' : 'hover:bg-[#FF6B35]/[0.02]'
                }`}
                style={{ gridTemplateColumns: canEdit ? '2fr 3fr 1fr 44px' : '2fr 3fr 1fr' }}
              >
                {/* Name */}
                <div
                  className={`px-4 py-3.5 flex items-center ${canEdit ? 'cursor-text' : ''}`}
                  onClick={() => startEdit(item, 'name')}
                >
                  {editingCell?.itemId === item.id && editingCell.field === 'name' ? (
                    <div className="flex items-center gap-1.5 w-full" onClick={e => e.stopPropagation()}>
                      <input
                        ref={el => { editInputRef.current = el; }}
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-2 py-1 text-sm border border-[#FF6B35] rounded-lg outline-none text-[#0D0F14] min-w-0"
                      />
                      <button onClick={commitEdit} disabled={saving} className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        {saving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                      </button>
                      <button onClick={cancelEdit} className="w-6 h-6 rounded bg-[#0D0F14]/08 text-[#0D0F14]/60 flex items-center justify-center shrink-0">
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <span className={`text-sm font-medium text-[#0D0F14] truncate ${canEdit ? 'group-hover:text-[#FF6B35] transition-colors' : ''}`}>
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div
                  className={`px-4 py-3.5 flex items-center ${canEdit ? 'cursor-text' : ''}`}
                  onClick={() => startEdit(item, 'description')}
                >
                  {editingCell?.itemId === item.id && editingCell.field === 'description' ? (
                    <div className="flex items-center gap-1.5 w-full" onClick={e => e.stopPropagation()}>
                      <input
                        ref={el => { editInputRef.current = el; }}
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-2 py-1 text-sm border border-[#FF6B35] rounded-lg outline-none text-[#0D0F14] min-w-0"
                      />
                      <button onClick={commitEdit} disabled={saving} className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        {saving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                      </button>
                      <button onClick={cancelEdit} className="w-6 h-6 rounded bg-[#0D0F14]/08 text-[#0D0F14]/60 flex items-center justify-center shrink-0">
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-[#0D0F14]/60 truncate">{item.description}</span>
                  )}
                </div>

                {/* Price */}
                <div
                  className={`px-4 py-3.5 flex items-center ${canEdit ? 'cursor-text' : ''}`}
                  onClick={() => startEdit(item, 'price')}
                >
                  {editingCell?.itemId === item.id && editingCell.field === 'price' ? (
                    <div className="flex items-center gap-1.5 w-full" onClick={e => e.stopPropagation()}>
                      <input
                        ref={el => { editInputRef.current = el; }}
                        type="number"
                        min="0"
                        step="0.01"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-2 py-1 text-sm border border-[#FF6B35] rounded-lg outline-none text-[#0D0F14] min-w-0"
                      />
                      <button onClick={commitEdit} disabled={saving} className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        {saving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                      </button>
                      <button onClick={cancelEdit} className="w-6 h-6 rounded bg-[#0D0F14]/08 text-[#0D0F14]/60 flex items-center justify-center shrink-0">
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-[#0D0F14]">
                      {item.price.toLocaleString('ru')} ₽
                    </span>
                  )}
                </div>

                {/* Delete button */}
                {canEdit && (
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteRow(item.id)}
                      disabled={deletingRowId === item.id}
                      className="w-8 h-8 rounded-lg text-[#0D0F14]/20 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    >
                      {deletingRowId === item.id
                        ? <Loader2 size={13} className="animate-spin" />
                        : <Trash2 size={13} />}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Footer: total */}
          {filteredItems.length > 0 && (
            <div
              className="grid border-t border-[#0D0F14]/10 bg-[#F8F7F4]"
              style={{ gridTemplateColumns: canEdit ? '2fr 3fr 1fr 44px' : '2fr 3fr 1fr' }}
            >
              <div className="px-4 py-3 text-xs font-semibold text-[#0D0F14]/40 uppercase tracking-widest col-span-2">
                Итого
              </div>
              <div className="px-4 py-3 text-sm font-black text-[#0D0F14]">
                {filteredItems.reduce((s, i) => s + i.price, 0).toLocaleString('ru')} ₽
              </div>
              {canEdit && <div />}
            </div>
          )}
        </div>
      </main>

      {/* ── Add row modal ──────────────────────────────────────── */}
      {showAddRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-[#0D0F14]/08">
            <h3 className="text-lg font-bold text-[#0D0F14] mb-5">Новая позиция</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#0D0F14]/50 uppercase tracking-widest block mb-1.5">Название</label>
                <input
                  type="text"
                  placeholder="Перфоратор Bosch GBH 2-26"
                  value={newRow.name}
                  onChange={e => setNewRow(p => ({ ...p, name: e.target.value }))}
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-[#0D0F14]/15 text-sm text-[#0D0F14] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#0D0F14]/50 uppercase tracking-widest block mb-1.5">Описание</label>
                <input
                  type="text"
                  placeholder="Ударный режим, 800 Вт, SDS-plus"
                  value={newRow.description}
                  onChange={e => setNewRow(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#0D0F14]/15 text-sm text-[#0D0F14] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#0D0F14]/50 uppercase tracking-widest block mb-1.5">Цена, ₽</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="12500"
                  value={newRow.price}
                  onChange={e => setNewRow(p => ({ ...p, price: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleAddRow()}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#0D0F14]/15 text-sm text-[#0D0F14] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { setShowAddRow(false); setNewRow({ name: '', description: '', price: '' }); }}
                className="flex-1 py-2.5 rounded-xl border border-[#0D0F14]/15 text-sm font-medium text-[#0D0F14]/60 hover:bg-[#0D0F14]/05 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleAddRow}
                disabled={addingRow || !newRow.name.trim() || !newRow.description.trim() || !newRow.price}
                className="flex-1 py-2.5 rounded-xl bg-[#FF6B35] text-white text-sm font-semibold disabled:opacity-50 hover:bg-[#ff7a46] transition-all flex items-center justify-center gap-2"
              >
                {addingRow ? <Loader2 size={14} className="animate-spin" /> : null}
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}