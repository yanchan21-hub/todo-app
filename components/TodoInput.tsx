'use client';

import { useState, type FormEvent } from 'react';

type Props = {
  onAdd: (text: string) => void;
};

export default function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
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
    </form>
  );
}
