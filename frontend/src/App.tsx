import { useEffect, useState } from 'react';
import { Calendar } from './components/Calendar';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { ProfileSelector } from './components/ProfileSelector';
import { Dashboard } from './components/Dashboard';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD format
  profileId: string;
}

export interface Profile {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const defaultProfiles: Profile[] = [
  { id: '1', name: 'Work', color: 'blue', icon: 'briefcase' },
  { id: '2', name: 'Creative', color: 'purple', icon: 'palette' },
  { id: '3', name: 'Home', color: 'green', icon: 'home' },
];

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8081';

const normalizeTodoDate = (todo: Todo): Todo => ({
  ...todo,
  // backend returns ISO string; keep YYYY-MM-DD for UI filters
  date: todo.date?.slice(0, 10),
});

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>(defaultProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string>('1');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateStr = formatDate(selectedDate);

  const todosForActiveProfile = todos.filter((todo) => todo.profileId === activeProfileId);

  const todosForSelectedDate = todosForActiveProfile.filter(
    (todo) => todo.date === selectedDateStr
  );

  useEffect(() => {
    const controller = new AbortController();
    const fetchTodos = async () => {
      try {
        const params = new URLSearchParams({
          date: selectedDateStr,
          profileId: activeProfileId,
        });
        const res = await fetch(`${API_BASE_URL}/api/todos?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`failed to fetch todos: ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          setTodos([]);
          return;
        }
        setTodos(data.map(normalizeTodoDate));
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error(err);
      }
    };

    fetchTodos();
    return () => controller.abort();
  }, [activeProfileId, selectedDateStr]);

  const handleAddTodo = async (text: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          date: selectedDateStr,
          profileId: activeProfileId,
        }),
      });
      if (!res.ok) {
        throw new Error(`failed to create todo: ${res.status}`);
      }
      const created: Todo = await res.json();
      setTodos((prev) => [...prev, normalizeTodoDate(created)]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTodo = async (id: string, text: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        throw new Error(`failed to update todo: ${res.status}`);
      }
      const updated: Todo = await res.json();
      setTodos((prev) => prev.map((todo) => (todo.id === id ? normalizeTodoDate(updated) : todo)));
      setEditingTodo(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTodo = async (id: string) => {
    const target = todos.find((todo) => todo.id === id);
    if (!target) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !target.completed }),
      });
      if (!res.ok) {
        throw new Error(`failed to toggle todo: ${res.status}`);
      }
      const updated: Todo = await res.json();
      setTodos((prev) => prev.map((todo) => (todo.id === id ? normalizeTodoDate(updated) : todo)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(`failed to delete todo: ${res.status}`);
      }
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      if (editingTodo?.id === id) {
        setEditingTodo(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTodoCountForDate = (date: Date): number => {
    const dateStr = formatDate(date);
    return todosForActiveProfile.filter((todo) => todo.date === dateStr).length;
  };

  const handleAddProfile = (profile: Omit<Profile, 'id'>) => {
    const newProfile: Profile = {
      ...profile,
      id: Date.now().toString(),
    };
    setProfiles([...profiles, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const handleUpdateProfile = (id: string, updates: Omit<Profile, 'id'>) => {
    setProfiles(
      profiles.map((profile) =>
        profile.id === id ? { ...profile, ...updates } : profile
      )
    );
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    setProfiles(profiles.filter((profile) => profile.id !== id));
    setTodos(todos.filter((todo) => todo.profileId !== id));
    if (activeProfileId === id) {
      setActiveProfileId(profiles.find((p) => p.id !== id)?.id || profiles[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-gray-900">Task Dashboard</h1>
            <ProfileSelector
              profiles={profiles}
              activeProfileId={activeProfileId}
              onSelectProfile={setActiveProfileId}
              onAddProfile={handleAddProfile}
              onUpdateProfile={handleUpdateProfile}
              onDeleteProfile={handleDeleteProfile}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 md:px-8 py-6">
        {/* Dashboard Stats */}
        <Dashboard
          todos={todosForActiveProfile}
          profile={activeProfile}
          selectedDate={selectedDate}
        />

        {/* Calendar and Todo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              getTodoCount={getTodoCountForDate}
              profileColor={activeProfile.color}
            />
          </div>

          {/* Todo Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="mb-4">
              <h2 className="text-gray-900 mb-1">
                {selectedDate.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              weekday: 'long',
                })}
              </h2>
              <p className="text-gray-500 text-sm">
                {todosForSelectedDate.length}件のタスク
              </p>
            </div>

            <TodoForm
              onSubmit={editingTodo ? (text) => handleUpdateTodo(editingTodo.id, text) : handleAddTodo}
              editingTodo={editingTodo}
              onCancelEdit={() => setEditingTodo(null)}
              profileColor={activeProfile.color}
            />

            <div className="flex-1 overflow-y-auto mt-6">
              <TodoList
                todos={todosForSelectedDate}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onEdit={setEditingTodo}
                profileColor={activeProfile.color}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
