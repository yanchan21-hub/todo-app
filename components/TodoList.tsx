import type { Todo } from '@/types/todo';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TodoList({ todos, onToggle, onDelete }: Props) {
  if (todos.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <p className="text-lg">まだタスクがありません</p>
        <p className="mt-1 text-sm">上の入力欄からタスクを追加してみましょう</p>
      </div>
    );
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div>
      <p className="mb-3 text-sm text-gray-500">
        {remaining === 0 ? '全てのタスクが完了しました 🎉' : `残り ${remaining} 件`}
      </p>
      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}
