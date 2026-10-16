import React, { useState } from 'react';
import { ScheduleItem } from '../App';

type ScheduleProps = {
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  subjects: string[];
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Schedule({ schedule, setSchedule, subjects }: ScheduleProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day: 'Monday',
    startTime: '06:00',
    endTime: '07:00',
    subject: subjects[0],
    topic: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSchedule((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...formData } : item
        )
      );
      setEditingId(null);
    } else {
      const newItem: ScheduleItem = {
        id: Date.now().toString(),
        ...formData,
      };
      setSchedule((prev) => [...prev, newItem]);
    }
    setFormData({ day: 'Monday', startTime: '06:00', endTime: '07:00', subject: subjects[0], topic: '' });
    setShowForm(false);
  };

  const handleEdit = (item: ScheduleItem) => {
    setFormData({
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
      subject: item.subject,
      topic: item.topic,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setSchedule((prev) => prev.filter((item) => item.id !== id));
  };

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
          <h1 className="text-3xl font-bold text-white">📅 Weekly Schedule</h1>
          <p className="text-purple-300 mt-1">Plan your study sessions for the week</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ day: 'Monday', startTime: '06:00', endTime: '07:00', subject: subjects[0], topic: '' });
          }}
          className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Session
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingId ? 'Edit Session' : 'New Study Session'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day} className="bg-slate-800">
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
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
              <label className="text-gray-400 text-sm mb-1 block">Topic</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., Newton's Laws"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule by Day */}
      <div className="space-y-4">
        {DAYS.map((day) => {
          const daySchedule = schedule
            .filter((item) => item.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          if (daySchedule.length === 0) return null;

          return (
            <div key={day} className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-400"></span>
                {day}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {daySchedule.map((item) => (
                  <div
                    key={item.id}
                    className="relative group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium text-white bg-gradient-to-r ${
                            subjectColors[item.subject] || 'from-gray-500 to-gray-600'
                          }`}
                        >
                          {item.subject}
                        </span>
                        <p className="text-white font-medium mt-2">{item.topic || 'Study Session'}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          <i className="fas fa-clock mr-1"></i>
                          {item.startTime} - {item.endTime}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
