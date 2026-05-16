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

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
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

      <span
        className={`flex-1 break-all text-base leading-relaxed
          ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
      >
        {todo.text}
      </span>

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
