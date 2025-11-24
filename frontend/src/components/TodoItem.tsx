import { Check, Pencil, Trash2 } from 'lucide-react';
import { Todo } from '../App';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  profileColor: string;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, profileColor }: TodoItemProps) {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string }> = {
      blue: { bg: 'bg-blue-600', border: 'border-blue-600 hover:border-blue-600' },
      purple: { bg: 'bg-purple-600', border: 'border-purple-600 hover:border-purple-600' },
      green: { bg: 'bg-green-600', border: 'border-green-600 hover:border-green-600' },
      red: { bg: 'bg-red-600', border: 'border-red-600 hover:border-red-600' },
      orange: { bg: 'bg-orange-600', border: 'border-orange-600 hover:border-orange-600' },
      pink: { bg: 'bg-pink-600', border: 'border-pink-600 hover:border-pink-600' },
      indigo: { bg: 'bg-indigo-600', border: 'border-indigo-600 hover:border-indigo-600' },
    };
    return colors[color] || colors.blue;
  };

  const colorClasses = getColorClasses(profileColor);

  return (
    <div
      className={`
        group flex items-center gap-3 p-3 rounded-lg border-2 transition-all
        ${todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-gray-300'}
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`
          flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
          ${
            todo.completed
              ? `${colorClasses.bg} ${colorClasses.border.split(' ')[0]}`
              : `border-gray-300 ${colorClasses.border}`
          }
        `}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
      >
        {todo.completed && <Check className="w-4 h-4 text-white" />}
      </button>

      {/* Text */}
      <span
        className={`
          flex-1 transition-all
          ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}
        `}
      >
        {todo.text}
      </span>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(todo)}
          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
          aria-label="編集"
        >
          <Pencil className="w-4 h-4 text-indigo-600" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="削除"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}
