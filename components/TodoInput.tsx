'use client';

import { useState, type FormEvent } from 'react';
import { CATEGORIES, type Category } from '@/types/todo';

type Props = {
  onAdd: (text: string, category: Category, dueDate?: string) => void;
};

const ACTIVE_STYLES: Record<Category, string> = {
  '仕事': 'border-blue-400 bg-blue-50 text-blue-700',
  '学習': 'border-purple-400 bg-purple-50 text-purple-700',
  '家事': 'border-green-400 bg-green-50 text-green-700',
  'その他': 'border-gray-400 bg-gray-50 text-gray-600',
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const SELECT_CLASS =
  'rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-300';

function todayString(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

export default function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [category, setCategory] = useState<Category>('仕事');
  const [dueDate, setDueDate] = useState(todayString());
  const [dueHour, setDueHour] = useState(0);
  const [dueMinute, setDueMinute] = useState(0);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const due = dueDate
      ? `${dueDate}T${String(dueHour).padStart(2, '0')}:${String(dueMinute).padStart(2, '0')}`
      : undefined;
    onAdd(trimmed, category, due);
    setValue('');
    setDueDate(todayString());
    setDueHour(0);
    setDueMinute(0);
  }

  function handleClear() {
    setDueDate('');
    setDueHour(0);
    setDueMinute(0);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="タスクを入力してください"
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
                     placeholder:text-gray-400"
          aria-label="新しいタスク"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="rounded-xl bg-blue-500 px-5 py-3 text-base font-semibold text-white
                     transition-colors hover:bg-blue-600 active:bg-blue-700
                     disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
        >
          追加
        </button>
      </div>

      <div className="flex gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors
              ${
                category === cat
                  ? ACTIVE_STYLES[cat]
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="shrink-0 text-sm text-gray-500">期限日</span>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700
                     focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <select
          value={dueHour}
          onChange={(e) => setDueHour(Number(e.target.value))}
          disabled={!dueDate}
          aria-label="時"
          className={SELECT_CLASS}
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>{h}時</option>
          ))}
        </select>
        <select
          value={dueMinute}
          onChange={(e) => setDueMinute(Number(e.target.value))}
          disabled={!dueDate}
          aria-label="分"
          className={SELECT_CLASS}
        >
          {MINUTES.map((min) => (
            <option key={min} value={min}>{String(min).padStart(2, '0')}分</option>
          ))}
        </select>
        {dueDate && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-400
                       transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            クリア
          </button>
        )}
      </div>
    </form>
  );
}
