import React from 'react';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-th-large' },
  { id: 'schedule', label: 'Schedule', icon: 'fa-calendar-alt' },
  { id: 'tasks', label: 'Tasks', icon: 'fa-tasks' },
  { id: 'timer', label: 'Study Timer', icon: 'fa-clock' },
  { id: 'notes', label: 'Notes', icon: 'fa-sticky-note' },
  { id: 'progress', label: 'Progress', icon: 'fa-chart-line' },
];

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, theme, toggleTheme }: SidebarProps) {
  const isDark = theme === 'dark';

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 h-screen w-64 border-r transition-colors duration-300
          ${isDark
            ? 'bg-slate-900/80 backdrop-blur-xl border-white/10'
            : 'bg-white/80 backdrop-blur-xl border-gray-200 shadow-lg'
          }`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <div>
              <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>StudyHub</h1>
              <p className={`text-xs ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Class 11 Planner</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="mb-6">
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${isDark
                  ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-yellow-500/20' : 'bg-indigo-500/20'
                }`}>
                  <i className={`fas ${isDark ? 'fa-sun text-yellow-400' : 'fa-moon text-indigo-500'} text-sm`}></i>
                </div>
                <span className="font-medium text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                isDark ? 'bg-purple-500/30' : 'bg-indigo-500/30'
              }`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${
                  isDark
                    ? 'left-5 bg-purple-400'
                    : 'left-0.5 bg-indigo-500'
                }`}></div>
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                  ${activeTab === item.id
                    ? isDark
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-400/30'
                      : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 border border-purple-200'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <div className={`ml-auto w-2 h-2 rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-600'}`}></div>
                )}
              </button>
            ))}
          </nav>

          {/* Motivational quote */}
          <div className={`mt-8 p-4 rounded-xl border transition-colors duration-300 ${
            isDark
              ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/20'
              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
          }`}>
            <p className={`text-sm italic ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>"Success is the sum of small efforts repeated day in and day out."</p>
            <p className={`text-xs mt-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>— Robert Collier</p>
          </div>
        </div>
      </aside>
    </>
  );
}
