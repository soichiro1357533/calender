import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Todo } from '../App';

interface TodoFormProps {
  onSubmit: (text: string) => void;
  editingTodo: Todo | null;
  onCancelEdit: () => void;
  profileColor: string;
}

export function TodoForm({ onSubmit, editingTodo, onCancelEdit, profileColor }: TodoFormProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setText(editingTodo.text);
    } else {
      setText('');
    }
  }, [editingTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  const handleCancel = () => {
    setText('');
    onCancelEdit();
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; hover: string; border: string; text: string }> = {
      blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', border: 'focus:border-blue-600', text: 'text-blue-900' },
      purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', border: 'focus:border-purple-600', text: 'text-purple-900' },
      green: { bg: 'bg-green-600', hover: 'hover:bg-green-700', border: 'focus:border-green-600', text: 'text-green-900' },
      red: { bg: 'bg-red-600', hover: 'hover:bg-red-700', border: 'focus:border-red-600', text: 'text-red-900' },
      orange: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', border: 'focus:border-orange-600', text: 'text-orange-900' },
      pink: { bg: 'bg-pink-600', hover: 'hover:bg-pink-700', border: 'focus:border-pink-600', text: 'text-pink-900' },
      indigo: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', border: 'focus:border-indigo-600', text: 'text-indigo-900' },
    };
    return colors[color] || colors.blue;
  };

  const colorClasses = getColorClasses(profileColor);

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {editingTodo && (
        <div className={`flex items-center justify-between px-3 py-2 ${profileColor === 'blue' ? 'bg-blue-50' : profileColor === 'purple' ? 'bg-purple-50' : profileColor === 'green' ? 'bg-green-50' : profileColor === 'red' ? 'bg-red-50' : profileColor === 'orange' ? 'bg-orange-50' : profileColor === 'pink' ? 'bg-pink-50' : 'bg-indigo-50'} rounded-lg`}>
          <span className={`text-sm ${colorClasses.text}`}>編集中</span>
          <button
            type="button"
            onClick={handleCancel}
            className={`${profileColor === 'blue' ? 'text-blue-600 hover:text-blue-800' : profileColor === 'purple' ? 'text-purple-600 hover:text-purple-800' : profileColor === 'green' ? 'text-green-600 hover:text-green-800' : profileColor === 'red' ? 'text-red-600 hover:text-red-800' : profileColor === 'orange' ? 'text-orange-600 hover:text-orange-800' : profileColor === 'pink' ? 'text-pink-600 hover:text-pink-800' : 'text-indigo-600 hover:text-indigo-800'}`}
            aria-label="キャンセル"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを追加..."
          className={`flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none ${colorClasses.border} transition-colors`}
        />
        <button
          type="submit"
          className={`px-6 py-3 ${colorClasses.bg} text-white rounded-lg ${colorClasses.hover} transition-colors flex items-center gap-2`}
          aria-label={editingTodo ? '更新' : '追加'}
        >
          {editingTodo ? (
            '更新'
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">追加</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
