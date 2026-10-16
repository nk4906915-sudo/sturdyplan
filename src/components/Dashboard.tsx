import React from 'react';
import { Task, StudySession, ScheduleItem } from '../App';

type DashboardProps = {
  tasks: Task[];
  sessions: StudySession[];
  schedule: ScheduleItem[];
  theme: 'dark' | 'light';
};

export default function Dashboard({ tasks, sessions, schedule, theme }: DashboardProps) {
  const isDark = theme === 'dark';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaySchedule = schedule.filter((s) => s.day === today);
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const highPriorityTasks = tasks.filter((t) => !t.completed && t.priority === 'high');

  const todaySessions = sessions.filter(
    (s) => s.date === new Date().toISOString().split('T')[0]
  );
  const totalStudyToday = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const totalStudyMinutes = Math.floor(totalStudyToday / 60);

  const streak = calculateStreak(sessions);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Good {getGreeting()}! 👋
          </h1>
          <p className={`mt-1 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
            {today} — Let's make today productive!
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border ${
            isDark
              ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30'
              : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
          }`}>
            <span className={`text-sm font-medium ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>🔥 {streak} day streak</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard isDark={isDark} icon="fa-book" label="Study Today" value={`${totalStudyMinutes} min`} color="from-blue-500 to-cyan-500" bgColor="from-blue-500/10 to-cyan-500/10" borderColor="border-blue-400/30" lightBg="from-blue-50 to-cyan-50" lightBorder="border-blue-200" />
        <StatCard isDark={isDark} icon="fa-check-circle" label="Tasks Done" value={`${completedTasks}/${tasks.length}`} color="from-green-500 to-emerald-500" bgColor="from-green-500/10 to-emerald-500/10" borderColor="border-green-400/30" lightBg="from-green-50 to-emerald-50" lightBorder="border-green-200" />
        <StatCard isDark={isDark} icon="fa-exclamation-circle" label="Pending" value={pendingTasks.toString()} color="from-yellow-500 to-orange-500" bgColor="from-yellow-500/10 to-orange-500/10" borderColor="border-yellow-400/30" lightBg="from-yellow-50 to-orange-50" lightBorder="border-yellow-200" />
        <StatCard isDark={isDark} icon="fa-fire" label="High Priority" value={highPriorityTasks.length.toString()} color="from-red-500 to-pink-500" bgColor="from-red-500/10 to-pink-500/10" borderColor="border-red-400/30" lightBg="from-red-50 to-pink-50" lightBorder="border-red-200" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className={`backdrop-blur-lg rounded-2xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <i className={`fas fa-calendar-day ${isDark ? 'text-purple-400' : 'text-purple-600'}`}></i>
            Today's Schedule
          </h2>
          {todaySchedule.length > 0 ? (
            <div className="space-y-3">
              {todaySchedule.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-center min-w-[60px]">
                    <p className={`text-xs ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>{item.startTime}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.endTime}</p>
                  </div>
                  <div className={`w-px h-8 ${isDark ? 'bg-purple-400/30' : 'bg-purple-200'}`}></div>
                  <div>
                    <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.subject}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.topic}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className={`fas fa-calendar-check text-4xl mb-3 ${isDark ? 'text-purple-400/50' : 'text-purple-300'}`}></i>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No classes scheduled for today!</p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Enjoy your free day 🎉</p>
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className={`backdrop-blur-lg rounded-2xl border p-6 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <i className={`fas fa-tasks ${isDark ? 'text-pink-400' : 'text-pink-600'}`}></i>
            Upcoming Tasks
          </h2>
          {pendingTasks > 0 ? (
            <div className="space-y-3">
              {tasks
                .filter((t) => !t.completed)
                .sort((a, b) => {
                  const priorityOrder = { high: 0, medium: 1, low: 2 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .slice(0, 5)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{task.title}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {task.subject} • Due: {task.dueDate}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className={`fas fa-check-double text-4xl mb-3 ${isDark ? 'text-green-400/50' : 'text-green-300'}`}></i>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>All caught up!</p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No pending tasks 🎊</p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Study Hours */}
      <div className={`backdrop-blur-lg rounded-2xl border p-6 ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <i className={`fas fa-chart-bar ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}></i>
          This Week's Study Time
        </h2>
        <WeeklyChart sessions={sessions} isDark={isDark} />
      </div>
    </div>
  );
}

function StatCard({
  isDark, icon, label, value, color, bgColor, borderColor, lightBg, lightBorder,
}: {
  isDark: boolean; icon: string; label: string; value: string;
  color: string; bgColor: string; borderColor: string; lightBg: string; lightBorder: string;
}) {
  return (
    <div className={`backdrop-blur-lg rounded-2xl border p-5 transition-colors duration-300 ${
      isDark
        ? `bg-gradient-to-br ${bgColor} ${borderColor}`
        : `bg-gradient-to-br ${lightBg} ${lightBorder}`
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <i className={`fas ${icon} text-white text-sm`}></i>
        </div>
        <div>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
          <p className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function WeeklyChart({ sessions, isDark }: { sessions: StudySession[]; isDark: boolean }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData = days.map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + index);
    const dateStr = date.toISOString().split('T')[0];
    const daySessions = sessions.filter((s) => s.date === dateStr);
    const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
    return { day: days[index], minutes: totalMinutes };
  });

  const maxMinutes = Math.max(...weekData.map((d) => d.minutes), 1);

  return (
    <div className="flex items-end justify-between gap-2 h-40">
      {weekData.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full relative flex flex-col justify-end h-28">
            <div
              className={`w-full rounded-t-lg transition-all duration-500 min-h-[4px] ${
                isDark ? 'bg-gradient-to-t from-purple-500 to-pink-500' : 'bg-gradient-to-t from-purple-400 to-pink-400'
              }`}
              style={{ height: `${(d.minutes / maxMinutes) * 100}%` }}
            ></div>
          </div>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{d.day}</span>
          <span className={`text-xs ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>{Math.floor(d.minutes / 60)}h</span>
        </div>
      ))}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

function calculateStreak(sessions: StudySession[]): number {
  if (sessions.length === 0) return 0;
  const uniqueDates = [...new Set(sessions.map((s) => s.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const prev = new Date(uniqueDates[i + 1]);
    const diff = (current.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
