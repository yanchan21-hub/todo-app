import type { Todo, Category } from '@/types/todo';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, category: Category, dueDate?: string) => void;
};

export default function TodoList({ todos, onToggle, onDelete, onEdit }: Props) {
  if (todos.length === 0) {
    return (
      <div className="py-14 text-center">
        <p className="text-5xl">📋</p>
        <p className="mt-4 text-base font-semibold text-gray-500">まだタスクがありません</p>
        <p className="mt-1 text-sm text-gray-400">上の入力欄からタスクを追加してみましょう</p>
      </div>
    );
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div>
      {remaining === 0 ? (
        <p className="mb-4 rounded-xl bg-emerald-50 py-2.5 text-center text-sm font-bold text-emerald-600 ring-1 ring-emerald-100">
          🎉 全てのタスクが完了しました！
        </p>
      ) : (
        <p className="mb-3 text-sm font-medium text-gray-400">
          残り{' '}
          <span className="font-extrabold text-violet-600">{remaining}</span> 件
        </p>
      )}

      <ul className="flex flex-col gap-2.5">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ul>
    </div>
  );
}
