import React, { useState } from 'react';
import { StudySession, Task } from '../App';

type ProgressProps = {
  sessions: StudySession[];
  tasks: Task[];
  subjects: string[];
};

export default function Progress({ sessions, tasks, subjects }: ProgressProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const now = new Date();
  const filteredSessions = sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 86400000);
      return sessionDate >= weekAgo;
    }
    if (timeRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 86400000);
      return sessionDate >= monthAgo;
    }
    return true;
  });

  // Subject-wise study time
  const subjectTime: Record<string, number> = {};
  subjects.forEach((subject) => {
    subjectTime[subject] = filteredSessions
      .filter((s) => s.subject === subject)
      .reduce((sum, s) => sum + s.duration, 0);
  });

  const totalMinutes = Object.values(subjectTime).reduce((a, b) => a + b, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const maxSubjectTime = Math.max(...Object.values(subjectTime), 1);

  // Task completion by subject
  const taskStats: Record<string, { total: number; completed: number }> = {};
  subjects.forEach((subject) => {
    const subjectTasks = tasks.filter((t) => t.subject === subject);
    taskStats[subject] = {
      total: subjectTasks.length,
      completed: subjectTasks.filter((t) => t.completed).length,
    };
  });

  // Daily study data for the selected range
  const dailyData: { date: string; minutes: number }[] = [];
  const daysToShow = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 14;
  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    const dateStr = date.toISOString().split('T')[0];
    const dayMinutes = filteredSessions
      .filter((s) => s.date === dateStr)
      .reduce((sum, s) => sum + s.duration, 0);
    dailyData.push({ date: dateStr, minutes: dayMinutes });
  }

  const maxDailyMinutes = Math.max(...dailyData.map((d) => d.minutes), 1);

  // Overall stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Average daily study time
  const uniqueDays = new Set(filteredSessions.map((s) => s.date)).size;
  const avgDailyMinutes = uniqueDays > 0 ? Math.round(totalMinutes / uniqueDays) : 0;

  const subjectColors: Record<string, string> = {
    Physics: 'from-blue-500 to-cyan-500',
    Chemistry: 'from-green-500 to-emerald-500',
    Mathematics: 'from-purple-500 to-violet-500',
    English: 'from-pink-500 to-rose-500',
    'Computer Science': 'from-orange-500 to-amber-500',
    'Physical Education': 'from-teal-500 to-green-500',
    Biology: 'from-lime-500 to-green-500',
    Economics: 'from-indigo-500 to-blue-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📊 Progress Tracker</h1>
          <p className="text-purple-300 mt-1">Monitor your study progress and performance</p>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-white/10 mt-4 md:mt-0">
          {(['week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-purple-500/30 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 text-center">
          <p className="text-3xl font-bold text-white">{totalHours}h</p>
          <p className="text-gray-400 text-sm mt-1">Total Study Time</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 text-center">
          <p className="text-3xl font-bold text-cyan-400">{Math.floor(avgDailyMinutes / 60)}h {avgDailyMinutes % 60}m</p>
          <p className="text-gray-400 text-sm mt-1">Avg Daily</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 text-center">
          <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
          <p className="text-gray-400 text-sm mt-1">Tasks Done</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 text-center">
          <p className="text-3xl font-bold text-purple-400">{completionRate}%</p>
          <p className="text-gray-400 text-sm mt-1">Completion Rate</p>
        </div>
      </div>

      {/* Daily Study Chart */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-chart-area text-cyan-400"></i>
          Daily Study Time
        </h2>
        <div className="flex items-end gap-1 h-40 overflow-x-auto">
          {dailyData.map((d, i) => (
            <div key={i} className="flex-1 min-w-[20px] flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end h-28">
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-purple-500 to-pink-500 transition-all duration-300 min-h-[2px] hover:from-purple-400 hover:to-pink-400"
                  style={{ height: `${(d.minutes / maxDailyMinutes) * 100}%` }}
                  title={`${Math.floor(d.minutes / 60)}h ${d.minutes % 60}m`}
                ></div>
              </div>
              {daysToShow <= 7 && (
                <span className="text-gray-500 text-[10px]">
                  {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subject-wise breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Time by Subject */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-book text-purple-400"></i>
            Study Time by Subject
          </h2>
          <div className="space-y-4">
            {subjects
              .filter((s) => subjectTime[s] > 0)
              .sort((a, b) => subjectTime[b] - subjectTime[a])
              .map((subject) => (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{subject}</span>
                    <span className="text-gray-400 text-sm">
                      {Math.floor(subjectTime[subject] / 60)}h {subjectTime[subject] % 60}m
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${subjectColors[subject] || 'from-gray-500 to-gray-600'} transition-all duration-500`}
                      style={{ width: `${(subjectTime[subject] / maxSubjectTime) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            {Object.values(subjectTime).every((t) => t === 0) && (
              <div className="text-center py-8">
                <i className="fas fa-clock text-4xl text-purple-400/40 mb-3"></i>
                <p className="text-gray-400">No study sessions recorded yet</p>
                <p className="text-gray-500 text-sm">Use the timer to track your study time!</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Completion by Subject */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-check-double text-green-400"></i>
            Task Completion by Subject
          </h2>
          <div className="space-y-4">
            {subjects
              .filter((s) => taskStats[s].total > 0)
              .map((subject) => {
                const stats = taskStats[subject];
                const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-medium">{subject}</span>
                      <span className="text-gray-400 text-sm">
                        {stats.completed}/{stats.total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            {Object.values(taskStats).every((s) => s.total === 0) && (
              <div className="text-center py-8">
                <i className="fas fa-tasks text-4xl text-green-400/40 mb-3"></i>
                <p className="text-gray-400">No tasks created yet</p>
                <p className="text-gray-500 text-sm">Add tasks to track your progress!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Study Distribution Pie Chart (CSS-based) */}
      {totalMinutes > 0 && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i className="fas fa-chart-pie text-pink-400"></i>
            Study Distribution
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* CSS Pie Chart */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {(() => {
                  let cumulativePercent = 0;
                  const colors = ['#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#f97316', '#14b8a6', '#84cc16', '#6366f1'];
                  return subjects
                    .filter((s) => subjectTime[s] > 0)
                    .map((subject, index) => {
                      const percent = (subjectTime[subject] / totalMinutes) * 100;
                      const startPercent = cumulativePercent;
                      cumulativePercent += percent;
                      const startAngle = (startPercent / 100) * 360;
                      const endAngle = (cumulativePercent / 100) * 360;
                      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                      
                      const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                      const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                      const endX = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                      const endY = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);

                      return (
                        <path
                          key={subject}
                          d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                          fill={colors[index % colors.length]}
                          opacity="0.8"
                        />
                      );
                    });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{totalHours}h</p>
                  <p className="text-gray-400 text-xs">Total</p>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-3">
              {subjects
                .filter((s) => subjectTime[s] > 0)
                .map((subject, index) => {
                  const colors = ['#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#f97316', '#14b8a6', '#84cc16', '#6366f1'];
                  const percent = Math.round((subjectTime[subject] / totalMinutes) * 100);
                  return (
                    <div key={subject} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span className="text-gray-300 text-sm">{subject} ({percent}%)</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-purple-400/20 p-6 text-center">
        <p className="text-2xl mb-2">🌟</p>
        <p className="text-white font-medium text-lg">
          {totalHours === 0
            ? "Start your first study session to see your progress!"
            : totalHours < 5
            ? "Great start! Keep building your study habit!"
            : totalHours < 20
            ? "You're making good progress! Keep it up!"
            : "Amazing dedication! You're on track for success!"}
        </p>
        <p className="text-purple-300 text-sm mt-2">
          {totalHours > 0 && `${totalHours} hours of focused study — every minute counts!`}
        </p>
      </div>
    </div>
  );
}
