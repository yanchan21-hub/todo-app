'use client';

import { useState, useEffect } from 'react';
import type { Todo, Category } from '@/types/todo';
import { loadTodos, saveTodos } from '@/lib/storage';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTodos(loadTodos());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveTodos(todos);
  }, [todos, mounted]);

  function handleAdd(text: string, category: Category, dueDate?: string) {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      category,
      ...(dueDate ? { dueDate } : {}),
    };
    setTodos((prev) => [newTodo, ...prev]);
  }

  function handleToggle(id: string) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function handleReset() {
    if (!window.confirm('全てのタスクを削除しますか？')) return;
    setTodos([]);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {mounted
              ? new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
              : ''}
            のToDoリスト
          </h1>
          <p className="mt-1 text-sm text-gray-500">タスクを整理して、一つずつ片付けましょう</p>
        </header>

        <section className="mb-6">
          <TodoInput onAdd={handleAdd} />
        </section>

        <section>
          {mounted ? (
            <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
          ) : (
            <div className="py-12 text-center text-gray-300 text-lg">読み込み中...</div>
          )}
        </section>

        {mounted && todos.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="rounded-xl border border-red-300 px-5 py-2.5 text-sm font-medium text-red-400
                         transition-colors hover:bg-red-50 hover:text-red-600 active:bg-red-100"
            >
              全て削除
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
