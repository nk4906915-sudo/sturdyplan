import React, { useState } from 'react';
import { Task } from '../App';

type TasksProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  subjects: string[];
  theme: 'dark' | 'light';
};

export default function Tasks({ tasks, setTasks, subjects, theme }: TasksProps) {
  const isDark = theme === 'dark';
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [formData, setFormData] = useState({ title: '', subject: subjects[0], priority: 'medium' as 'high' | 'medium' | 'low', dueDate: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const newTask: Task = { id: Date.now().toString(), title: formData.title, subject: formData.subject, priority: formData.priority, completed: false, dueDate: formData.dueDate, createdAt: new Date().toISOString() };
    setTasks((prev) => [...prev, newTask]);
    setFormData({ title: '', subject: subjects[0], priority: 'medium', dueDate: '' });
    setShowForm(false);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks
    .filter((task) => { if (filter === 'pending') return !task.completed; if (filter === 'completed') return task.completed; return true; })
    .filter((task) => { if (subjectFilter === 'all') return true; return task.subject === subjectFilter; })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const priorityColors = {
    high: isDark ? 'bg-red-500/20 text-red-300 border-red-400/30' : 'bg-red-50 text-red-600 border-red-200',
    medium: isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
    low: isDark ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-green-50 text-green-600 border-green-200',
  };

  const cardClass = `backdrop-blur-lg rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`;
  const inputClass = `w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-400 ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-900'}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>✅ Tasks & Assignments</h1>
          <p className={`mt-1 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Track your homework, assignments, and goals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity">
          <i className="fas fa-plus mr-2"></i>Add Task
        </button>
      </div>

      {showForm && (
        <div className={cardClass}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>New Task</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Task Title</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Complete Physics Numericals" className={`${inputClass} ${isDark ? 'placeholder-gray-500' : 'placeholder-gray-400'}`} />
            </div>
            <div>
              <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Subject</label>
              <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputClass}>
                {subjects.map((s) => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
              </select>
            </div>
            <div>
              <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })} className={inputClass}>
                <option value="high" className="bg-slate-800">🔴 High</option>
                <option value="medium" className="bg-slate-800">🟡 Medium</option>
                <option value="low" className="bg-slate-800">🟢 Low</option>
              </select>
            </div>
            <div>
              <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Due Date</label>
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className={inputClass} />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity">Add Task</button>
              <button type="button" onClick={() => setShowForm(false)} className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className={`flex rounded-xl overflow-hidden border ${isDark ? 'border-white/10' : 'border-gray-300'}`}>
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium transition-colors ${filter === f ? (isDark ? 'bg-purple-500/30 text-white' : 'bg-purple-100 text-purple-900') : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className={`${inputClass} text-sm`}>
          <option value="all" className="bg-slate-800">All Subjects</option>
          {subjects.map((s) => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <div key={task.id} className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${task.completed ? (isDark ? 'bg-white/3 border-white/5 opacity-60' : 'bg-gray-50 border-gray-200 opacity-60') : (isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm')}`}>
            <button onClick={() => toggleTask(task.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500' : (isDark ? 'border-gray-500 hover:border-purple-400' : 'border-gray-400 hover:border-purple-500')}`}>
              {task.completed && <i className="fas fa-check text-white text-xs"></i>}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${task.completed ? (isDark ? 'text-gray-500 line-through' : 'text-gray-400 line-through') : (isDark ? 'text-white' : 'text-gray-900')}`}>{task.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{task.subject}</span>
                {task.dueDate && <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}><i className="fas fa-calendar mr-1"></i>{task.dueDate}</span>}
              </div>
            </div>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${priorityColors[task.priority]}`}>{task.priority}</span>
            <button onClick={() => deleteTask(task.id)} className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all ${isDark ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}>
              <i className="fas fa-trash text-sm"></i>
            </button>
          </div>
        )) : (
          <div className={`text-center py-12 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
            <i className={`fas fa-clipboard-list text-5xl mb-4 ${isDark ? 'text-purple-400/40' : 'text-purple-300'}`}></i>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No tasks found</p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Add a new task to get started!</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {tasks.length > 0 && (
        <div className={`backdrop-blur-lg rounded-2xl border p-4 flex flex-wrap gap-6 justify-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="text-center"><p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{tasks.length}</p><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-green-400">{tasks.filter((t) => t.completed).length}</p><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completed</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-yellow-400">{tasks.filter((t) => !t.completed).length}</p><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pending</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-purple-400">{tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0}%</p><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Progress</p></div>
        </div>
      )}
    </div>
  );
}
