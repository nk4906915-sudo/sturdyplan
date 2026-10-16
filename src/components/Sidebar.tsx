import React from 'react';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-th-large' },
  { id: 'schedule', label: 'Schedule', icon: 'fa-calendar-alt' },
  { id: 'tasks', label: 'Tasks', icon: 'fa-tasks' },
  { id: 'timer', label: 'Study Timer', icon: 'fa-clock' },
  { id: 'notes', label: 'Notes', icon: 'fa-sticky-note' },
  { id: 'progress', label: 'Progress', icon: 'fa-chart-line' },
];

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: SidebarProps) {
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
        className={`fixed md:static z-50 h-screen w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">StudyHub</h1>
              <p className="text-purple-300 text-xs">Class 11 Planner</p>
            </div>
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
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-400/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-purple-400"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Motivational quote */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20">
            <p className="text-purple-200 text-sm italic">"Success is the sum of small efforts repeated day in and day out."</p>
            <p className="text-purple-400 text-xs mt-2">— Robert Collier</p>
          </div>
        </div>
      </aside>
    </>
  );
}
