'use client';

import type { Todo } from '@/types/todo';

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
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

      <span
        className={`flex-1 break-all text-base leading-relaxed
          ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
      >
        {todo.text}
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
