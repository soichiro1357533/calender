import { CheckCircle2, Circle, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { Todo, Profile } from '../App';

interface DashboardProps {
  todos: Todo[];
  profile: Profile;
  selectedDate: Date;
}

export function Dashboard({ todos, profile }: DashboardProps) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayTodos = todos.filter((t) => t.date === todayStr);
  const todayCompleted = todayTodos.filter((t) => t.completed).length;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const weekTodos = todos.filter((t) => {
    const todoDate = new Date(t.date);
    return todoDate >= weekStart && todoDate <= weekEnd;
  });
  const weekCompleted = weekTodos.filter((t) => t.completed).length;

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600',
      indigo: 'from-indigo-500 to-indigo-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">合計タスク数</p>
            <p className="text-gray-900">{totalTodos}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getColorClass(profile.color)} flex items-center justify-center`}>
            <Circle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">完了タスク</p>
            <p className="text-gray-900">{completedTodos}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">今日のタスク</p>
            <p className="text-gray-900">
              {todayCompleted} / {todayTodos.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">達成率</p>
            <p className="text-gray-900">{completionRate}%</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
        {totalTodos > 0 && (
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${getColorClass(profile.color)} transition-all duration-300`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
