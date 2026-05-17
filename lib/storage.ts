import type { Todo } from '@/types/todo';

const STORAGE_KEY = 'todo-app-todos';

export function loadTodos(): Todo[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<Todo>[];
    return parsed.map((t) => ({
      id: t.id ?? '',
      text: t.text ?? '',
      completed: t.completed ?? false,
      createdAt: t.createdAt ?? Date.now(),
      category: t.category ?? 'その他',
      ...(t.dueDate ? { dueDate: t.dueDate } : {}),
      ...(t.completedAt ? { completedAt: t.completedAt } : {}),
    }));
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
