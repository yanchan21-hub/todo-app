'use client';

import { useState } from 'react';
import type { Todo } from '@/types/todo';

type Props = {
  todos: Todo[];
};

const DOW = ['日', '月', '火', '水', '木', '金', '土'];

function isDayAchievement(todos: Todo[], year: number, month: number, day: number): boolean {
  const dayStart = new Date(year, month, day).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;
  const dayTodos = todos.filter((t) => t.createdAt >= dayStart && t.createdAt < dayEnd);
  return dayTodos.length > 0 && dayTodos.every((t) => t.completed);
}

export default function CalendarView({ todos }: Props) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="mb-3 text-center text-xs font-semibold tracking-wide text-gray-400">
        達成カレンダー
      </p>

      {/* Month navigation */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-lg text-gray-400
                     transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {year}年 {month + 1}月
        </span>
        <button
          onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-lg text-gray-400
                     transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          ›
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DOW.map((label, i) => (
          <div
            key={label}
            className={`text-xs font-medium ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="h-8" />;

          const dayStart = new Date(year, month, day).getTime();
          const isToday = dayStart === todayStart;
          const isFuture = dayStart > todayStart;
          const achieved = !isFuture && isDayAchievement(todos, year, month, day);
          const dow = (firstDow + day - 1) % 7;

          let textColor = 'text-gray-600';
          if (isFuture) textColor = 'text-gray-300';
          else if (dow === 0) textColor = 'text-red-400';
          else if (dow === 6) textColor = 'text-blue-400';

          return (
            <div
              key={i}
              className={`flex flex-col items-center rounded-lg py-0.5 text-xs
                ${isToday ? 'bg-blue-500 font-semibold text-white' : textColor}`}
            >
              <span className="leading-5">{day}</span>
              {achieved && <span className="text-sm leading-4">👑</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
