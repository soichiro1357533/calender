import { Todo } from '../App';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  profileColor: string;
}

export function TodoList({ todos, onToggle, onDelete, onEdit, profileColor }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>タスクがありません</p>
        <p className="text-sm mt-2">新しいタスクを追加してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          profileColor={profileColor}
        />
      ))}
    </div>
  );
}