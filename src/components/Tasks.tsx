import React, { useState } from 'react';
import { Task } from '../App';

type TasksProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  subjects: string[];
};

export default function Tasks({ tasks, setTasks, subjects }: TasksProps) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    subject: subjects[0],
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      priority: formData.priority,
      completed: false,
      dueDate: formData.dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    setFormData({ title: '', subject: subjects[0], priority: 'medium', dueDate: '' });
    setShowForm(false);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'pending') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    })
    .filter((task) => {
      if (subjectFilter === 'all') return true;
      return task.subject === subjectFilter;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const priorityColors = {
    high: 'bg-red-500/20 text-red-300 border-red-400/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    low: 'bg-green-500/20 text-green-300 border-green-400/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">✅ Tasks & Assignments</h1>
          <p className="text-purple-300 mt-1">Track your homework, assignments, and goals</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Task
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-white mb-4">New Task</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">Task Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Complete Physics Numericals Chapter 3"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject} className="bg-slate-800">
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="high" className="bg-slate-800">🔴 High</option>
                <option value="medium" className="bg-slate-800">🟡 Medium</option>
                <option value="low" className="bg-slate-800">🟢 Low</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-purple-500/30 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
        >
          <option value="all" className="bg-slate-800">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject} className="bg-slate-800">
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
                task.completed
                  ? 'bg-white/3 border-white/5 opacity-60'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-500 hover:border-purple-400'
                }`}
              >
                {task.completed && <i className="fas fa-check text-white text-xs"></i>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-gray-400 text-xs">{task.subject}</span>
                  {task.dueDate && (
                    <span className="text-gray-500 text-xs">
                      <i className="fas fa-calendar mr-1"></i>
                      {task.dueDate}
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
              >
                <i className="fas fa-trash text-sm"></i>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <i className="fas fa-clipboard-list text-5xl text-purple-400/40 mb-4"></i>
            <p className="text-gray-400 text-lg">No tasks found</p>
            <p className="text-gray-500 text-sm mt-1">Add a new task to get started!</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {tasks.length > 0 && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4 flex flex-wrap gap-6 justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{tasks.length}</p>
            <p className="text-gray-400 text-xs">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{tasks.filter((t) => t.completed).length}</p>
            <p className="text-gray-400 text-xs">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{tasks.filter((t) => !t.completed).length}</p>
            <p className="text-gray-400 text-xs">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0}%
            </p>
            <p className="text-gray-400 text-xs">Progress</p>
          </div>
        </div>
      )}
    </div>
  );
}
