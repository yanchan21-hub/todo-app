'use client';

import type { Todo, Category } from '@/types/todo';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const BADGE_STYLES: Record<Category, string> = {
  '仕事': 'bg-blue-100 text-blue-700 border-blue-200',
  '学習': 'bg-purple-100 text-purple-700 border-purple-200',
  '家事': 'bg-green-100 text-green-700 border-green-200',
  'その他': 'bg-gray-100 text-gray-600 border-gray-200',
};

const LEFT_BORDER: Record<Category, string> = {
  '仕事': 'border-l-blue-400',
  '学習': 'border-l-purple-400',
  '家事': 'border-l-green-400',
  'その他': 'border-l-gray-300',
};

type DueStatus = 'overdue' | 'today' | 'soon' | 'normal';

const DUE_BADGE_STYLES: Record<DueStatus, string> = {
  overdue: 'border-red-200 bg-red-100 text-red-600',
  today:   'border-orange-200 bg-orange-100 text-orange-600',
  soon:    'border-yellow-200 bg-yellow-100 text-yellow-700',
  normal:  'border-gray-200 bg-gray-100 text-gray-500',
};

// YYYY-MM-DDTHH:MM → Date (local time). Falls back to date-only parsing for legacy data.
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

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  const dueStatus = todo.dueDate ? getDueStatus(todo.dueDate) : null;

  return (
    <li
      className={`flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm
        border-l-4 ${LEFT_BORDER[todo.category]}`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors
          ${
            todo.completed
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-gray-300 bg-white hover:border-blue-400'
          }`}
      >
        {todo.completed && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`break-all text-base leading-relaxed
            ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
        >
          {todo.text}
        </p>
        {todo.dueDate && (
          <span
            className={`mt-1 inline-block rounded border px-1.5 py-0.5 text-xs font-medium
              ${
                todo.completed
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

      <span
        className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${BADGE_STYLES[todo.category]}`}
      >
        {todo.category}
      </span>

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
