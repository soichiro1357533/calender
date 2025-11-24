import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  getTodoCount: (date: Date) => number;
  profileColor: string;
}

export function Calendar({ selectedDate, onSelectDate, getTodoCount, profileColor }: CalendarProps) {
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; hover: string; border: string; dot: string }> = {
      blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', border: 'border-blue-600', dot: 'bg-blue-600' },
      purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', border: 'border-purple-600', dot: 'bg-purple-600' },
      green: { bg: 'bg-green-600', hover: 'hover:bg-green-700', border: 'border-green-600', dot: 'bg-green-600' },
      red: { bg: 'bg-red-600', hover: 'hover:bg-red-700', border: 'border-red-600', dot: 'bg-red-600' },
      orange: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', border: 'border-orange-600', dot: 'bg-orange-600' },
      pink: { bg: 'bg-pink-600', hover: 'hover:bg-pink-700', border: 'border-pink-600', dot: 'bg-pink-600' },
      indigo: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', border: 'border-indigo-600', dot: 'bg-indigo-600' },
    };
    return colors[color] || colors.blue;
  };

  const colorClasses = getColorClasses(profileColor);

  const previousMonth = () => {
    onSelectDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    onSelectDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const handleDayClick = (day: number) => {
    onSelectDate(new Date(currentYear, currentMonth, day));
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const days = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const todoCount = getTodoCount(date);
    const today = isToday(day);
    const selected = isSelected(day);

    days.push(
      <button
        key={day}
        onClick={() => handleDayClick(day)}
        className={`
          aspect-square rounded-lg flex flex-col items-center justify-center
          transition-all hover:bg-gray-50 relative
          ${selected ? `${colorClasses.bg} text-white ${colorClasses.hover}` : ''}
          ${today && !selected ? `border-2 ${colorClasses.border} text-${profileColor}-600` : ''}
          ${!selected && !today ? 'text-gray-700' : ''}
        `}
      >
        <span>{day}</span>
        {todoCount > 0 && (
          <div
            className={`
              absolute bottom-1 left-1/2 transform -translate-x-1/2
              flex gap-0.5
            `}
          >
            {[...Array(Math.min(todoCount, 3))].map((_, i) => (
              <div
                key={i}
                className={`
                  w-1 h-1 rounded-full
                  ${selected ? 'bg-white' : colorClasses.dot}
                `}
              />
            ))}
          </div>
        )}
      </button>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="前の月"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-gray-900">
          {currentYear}年 {currentMonth + 1}月
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="次の月"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`
              text-center text-sm
              ${index === 0 ? 'text-red-500' : ''}
              ${index === 6 ? 'text-blue-500' : ''}
              ${index !== 0 && index !== 6 ? 'text-gray-600' : ''}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
}