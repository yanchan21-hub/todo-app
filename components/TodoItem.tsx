'use client';

import { useState, useEffect, useRef } from 'react';
import { CATEGORIES, type Todo, type Category } from '@/types/todo';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, category: Category, dueDate?: string) => void;
};

const BADGE_STYLES: Record<Category, string> = {
  '仕事':  'bg-blue-100    text-blue-700    border-blue-200',
  '学習':  'bg-purple-100  text-purple-700  border-purple-200',
  '家事':  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'その他': 'bg-gray-100    text-gray-600    border-gray-200',
};

const LEFT_BORDER: Record<Category, string> = {
  '仕事':  'border-l-blue-400',
  '学習':  'border-l-purple-400',
  '家事':  'border-l-emerald-400',
  'その他': 'border-l-gray-300',
};

const CAT_ACTIVE: Record<Category, string> = {
  '仕事':  'border-blue-400    bg-blue-50    text-blue-700',
  '学習':  'border-purple-400  bg-purple-50  text-purple-700',
  '家事':  'border-emerald-400 bg-emerald-50 text-emerald-700',
  'その他': 'border-gray-400    bg-gray-50    text-gray-600',
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const SELECT_CLASS =
  'rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-700 ' +
  'focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 ' +
  'disabled:bg-gray-50 disabled:text-gray-300';

type DueStatus = 'overdue' | 'today' | 'soon' | 'normal';

const DUE_BADGE_STYLES: Record<DueStatus, string> = {
  overdue: 'border-red-200    bg-red-100    text-red-600',
  today:   'border-orange-200 bg-orange-100 text-orange-600',
  soon:    'border-yellow-200 bg-yellow-100 text-yellow-700',
  normal:  'border-gray-200   bg-gray-100   text-gray-500',
};

function parseDueDate(dueDate: string): Date {
  if (dueDate.includes('T')) return new Date(dueDate);
  const [y, m, d] = dueDate.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(dueDate: string): string {
  const due = parseDueDate(dueDate);
  const m = due.getMonth() + 1;
  const d = due.getDate();
  if (dueDate.includes('T')) {
    const h = String(due.getHours()).padStart(2, '0');
    const min = String(due.getMinutes()).padStart(2, '0');
    return `${m}/${d} ${h}:${min}`;
  }
  return `${m}/${d}`;
}

function getDueStatus(dueDate: string): DueStatus {
  const now = new Date();
  const due = parseDueDate(dueDate);
  if (due < now) return 'overdue';
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const dayDiff = Math.round((dueStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));
  if (dayDiff === 0) return 'today';
  if (dayDiff <= 2) return 'soon';
  return 'normal';
}

function getDueDateLabel(dueDate: string, status: DueStatus): string {
  const dateStr = formatDate(dueDate);
  if (status === 'overdue') return `${dateStr} 期限切れ`;
  if (status === 'today') return `今日まで (${dateStr})`;
  if (status === 'soon') {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const due = parseDueDate(dueDate);
    const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffDays = Math.round((dueStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));
    return `あと${diffDays}日 (${dateStr})`;
  }
  return dateStr;
}

function splitDueDate(dueDate?: string) {
  if (!dueDate) return { date: '', hour: 0, minute: 0 };
  if (dueDate.includes('T')) {
    const [datePart, timePart] = dueDate.split('T');
    const [h, m] = timePart.split(':').map(Number);
    const roundedMinute = Math.min(55, Math.round(m / 5) * 5);
    return { date: datePart, hour: h, minute: roundedMinute };
  }
  return { date: dueDate, hour: 0, minute: 0 };
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState<Category>('仕事');
  const [editDueDate, setEditDueDate] = useState('');
  const [editHour, setEditHour] = useState(0);
  const [editMinute, setEditMinute] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const prevCompleted = useRef(todo.completed);

  useEffect(() => {
    if (!prevCompleted.current && todo.completed) {
      setCelebrating(true);
      const t = setTimeout(() => setCelebrating(false), 600);
      prevCompleted.current = todo.completed;
      return () => clearTimeout(t);
    }
    prevCompleted.current = todo.completed;
  }, [todo.completed]);

  function startEdit() {
    const split = splitDueDate(todo.dueDate);
    setEditText(todo.text);
    setEditCategory(todo.category);
    setEditDueDate(split.date);
    setEditHour(split.hour);
    setEditMinute(split.minute);
    setIsEditing(true);
  }

  function handleSave() {
    const trimmed = editText.trim();
    if (!trimmed) return;
    const due = editDueDate
      ? `${editDueDate}T${String(editHour).padStart(2, '0')}:${String(editMinute).padStart(2, '0')}`
      : undefined;
    onEdit(todo.id, trimmed, editCategory, due);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li
        className={`flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60
          px-4 py-4 shadow-md border-l-4 ${LEFT_BORDER[editCategory]} animate-slide-up`}
      >
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-base text-gray-800
                     focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setEditCategory(cat)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all
                ${editCategory === cat
                  ? CAT_ACTIVE[cat]
                  : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 text-sm font-medium text-gray-400">期限</span>
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-700
                       focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
          <select
            value={editHour}
            onChange={(e) => setEditHour(Number(e.target.value))}
            disabled={!editDueDate}
            aria-label="時"
            className={SELECT_CLASS}
          >
            {HOURS.map((h) => <option key={h} value={h}>{h}時</option>)}
          </select>
          <select
            value={editMinute}
            onChange={(e) => setEditMinute(Number(e.target.value))}
            disabled={!editDueDate}
            aria-label="分"
            className={SELECT_CLASS}
          >
            {MINUTES.map((min) => (
              <option key={min} value={min}>{String(min).padStart(2, '0')}分</option>
            ))}
          </select>
          {editDueDate && (
            <button
              type="button"
              onClick={() => { setEditDueDate(''); setEditHour(0); setEditMinute(0); }}
              className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400
                         transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              クリア
            </button>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600
                       transition-colors hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!editText.trim()}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2
                       text-sm font-semibold text-white shadow-md shadow-violet-200
                       transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0
                       disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none"
          >
            保存
          </button>
        </div>
      </li>
    );
  }

  const dueStatus = todo.dueDate ? getDueStatus(todo.dueDate) : null;

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-sm
        border-l-4 transition-all duration-300 animate-slide-up
        ${LEFT_BORDER[todo.category]}
        ${celebrating ? 'animate-celebrate' : ''}
        ${todo.completed
          ? 'border-emerald-100 bg-emerald-50/70'
          : 'border-gray-100 bg-white hover:shadow-md'
        }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2
          transition-all duration-200
          ${todo.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-gray-300 bg-white hover:border-violet-400 hover:scale-110'
          }`}
      >
        {todo.completed && (
          <svg
            className="h-4 w-4 animate-check-pop"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={`break-all text-base leading-relaxed transition-all duration-300
            ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
        >
          {todo.text}
        </p>
        {todo.dueDate && (
          <span
            className={`mt-1 inline-block rounded-md border px-1.5 py-0.5 text-xs font-medium
              ${todo.completed
                ? 'border-gray-200 bg-gray-50 text-gray-400'
                : DUE_BADGE_STYLES[dueStatus ?? 'normal']
              }`}
          >
            {todo.completed
              ? `期限 ${formatDate(todo.dueDate)}`
              : getDueDateLabel(todo.dueDate, dueStatus ?? 'normal')}
          </span>
        )}
      </div>

      {/* Category badge */}
      <span className={`shrink-0 rounded-lg border px-2 py-0.5 text-xs font-semibold ${BADGE_STYLES[todo.category]}`}>
        {todo.category}
      </span>

      {/* Edit */}
      <button
        onClick={startEdit}
        aria-label="編集"
        className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-violet-400
                   transition-colors hover:bg-violet-50 hover:text-violet-600 active:bg-violet-100"
      >
        編集
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(todo.id)}
        aria-label="削除"
        className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-red-400
                   transition-colors hover:bg-red-50 hover:text-red-600 active:bg-red-100"
      >
        削除
      </button>
    </li>
  );
}
