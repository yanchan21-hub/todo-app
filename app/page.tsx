'use client';

import { useState, useEffect } from 'react';
import type { Todo, Category } from '@/types/todo';
import { loadTodos, saveTodos } from '@/lib/storage';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import CalendarView from '@/components/CalendarView';

function todayDateString(): string {
  return new Date().toDateString();
}

function isCompletedToday(completedAt: number | undefined, todayStr: string): boolean {
  if (!completedAt) return false;
  return new Date(completedAt).toDateString() === todayStr;
}

function getMotivationalMessage(remaining: number, total: number): string {
  if (total === 0) return 'さあ、今日のタスクを追加しましょう！';
  if (remaining === 0) return '全タスク完了！最高の一日！🌟';
  const pct = ((total - remaining) / total) * 100;
  if (pct === 0) return 'よし、始めよう！一歩一歩進もう 💪';
  if (pct < 50) return 'いい調子！このまま続けよう 🔥';
  return 'もうすぐゴール！ラストスパート！⚡';
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mounted, setMounted] = useState(false);
  // Tracks the current date; updates at midnight to trigger re-filter
  const [todayStr, setTodayStr] = useState(todayDateString);

  useEffect(() => {
    setTodos(loadTodos());
    setMounted(true);
  }, []);

  // Reset todayStr at midnight so completed-task filter refreshes automatically
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = midnight.getTime() - now.getTime();
    const timer = setTimeout(() => setTodayStr(todayDateString()), msUntilMidnight);
    return () => clearTimeout(timer);
  }, [todayStr]);

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
      prev.map((todo) => {
        if (todo.id !== id) return todo;
        const completed = !todo.completed;
        return { ...todo, completed, completedAt: completed ? Date.now() : undefined };
      })
    );
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function handleEdit(id: string, text: string, category: Category, dueDate?: string) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text, category, dueDate } : todo))
    );
  }

  function handleReset() {
    if (!window.confirm('全てのタスクを削除しますか？')) return;
    setTodos([]);
  }

  // Only show incomplete tasks or tasks completed today
  const displayedTodos = todos.filter(
    (t) => !t.completed || isCompletedToday(t.completedAt, todayStr)
  );

  const remaining = displayedTodos.filter((t) => !t.completed).length;
  const completed = displayedTodos.filter((t) => t.completed).length;
  const total = displayedTodos.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const message = getMotivationalMessage(remaining, total);

  const dateLabel = mounted
    ? new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })
    : '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">

        {/* ── Header ── */}
        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-bold text-violet-600">
            <span>⚡</span>
            <span>今日のミッション</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {dateLabel && `${dateLabel}のタスク`}
          </h1>

          <p className="mt-2 text-sm font-medium text-gray-500">{message}</p>

          {mounted && displayedTodos.length > 0 && (
            <div className="mx-auto mt-5 max-w-xs">
              {/* Stats cards */}
              <div className="mb-3 flex justify-center gap-3">
                <div className="flex-1 rounded-2xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-extrabold text-violet-600">{remaining}</p>
                  <p className="text-xs text-gray-400">残りタスク</p>
                </div>
                <div className="flex-1 rounded-2xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-extrabold text-emerald-500">{completed}</p>
                  <p className="text-xs text-gray-400">完了済み</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">{pct}% 完了</p>
            </div>
          )}
        </header>

        {/* ── Main layout ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Calendar sidebar — top on mobile, left on desktop */}
          {mounted && (
            <aside className="lg:sticky lg:top-8 lg:w-72 lg:shrink-0">
              <CalendarView todos={todos} />
            </aside>
          )}

          {/* Todo section */}
          <div className="min-w-0 flex-1">
            <section className="mb-5">
              <TodoInput onAdd={handleAdd} />
            </section>

            <section>
              {mounted ? (
                <TodoList
                  todos={displayedTodos}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ) : (
                <div className="py-12 text-center text-lg text-gray-300">読み込み中...</div>
              )}
            </section>

            {mounted && displayedTodos.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-400
                             transition-colors hover:bg-red-50 hover:text-red-600 active:bg-red-100"
                >
                  全て削除
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
