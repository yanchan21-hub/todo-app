'use client';

import { useState, type FormEvent } from 'react';
import { CATEGORIES, type Category } from '@/types/todo';

type Props = {
  onAdd: (text: string, category: Category) => void;
};

const ACTIVE_STYLES: Record<Category, string> = {
  '仕事': 'border-blue-400 bg-blue-50 text-blue-700',
  '学習': 'border-purple-400 bg-purple-50 text-purple-700',
  '家事': 'border-green-400 bg-green-50 text-green-700',
  'その他': 'border-gray-400 bg-gray-50 text-gray-600',
};

export default function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [category, setCategory] = useState<Category>('仕事');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed, category);
    setValue('');
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
    </form>
  );
}
