import React, { useState } from 'react';
import { Note } from '../App';

type NotesProps = {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  subjects: string[];
  theme: 'dark' | 'light';
};

export default function Notes({ notes, setNotes, subjects, theme }: NotesProps) {
  const isDark = theme === 'dark';
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '', subject: subjects[0] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    if (editingNote) {
      setNotes((prev) => prev.map((note) => note.id === editingNote.id ? { ...note, title: formData.title, content: formData.content, subject: formData.subject } : note));
      setEditingNote(null);
    } else {
      setNotes((prev) => [{ id: Date.now().toString(), title: formData.title, content: formData.content, subject: formData.subject, createdAt: new Date().toISOString() }, ...prev]);
    }
    setFormData({ title: '', content: '', subject: subjects[0] });
    setShowForm(false);
  };

  const handleEdit = (note: Note) => {
    setFormData({ title: note.title, content: note.content, subject: note.subject });
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = (id: string) => { setNotes((prev) => prev.filter((note) => note.id !== id)); };

  const filteredNotes = notes
    .filter((note) => subjectFilter === 'all' || note.subject === subjectFilter)
    .filter((note) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q) || note.subject.toLowerCase().includes(q);
    });

  const subjectColors: Record<string, string> = {
    Physics: isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700',
    Chemistry: isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700',
    Mathematics: isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700',
    English: isDark ? 'bg-pink-500/20 text-pink-300' : 'bg-pink-100 text-pink-700',
    'Computer Science': isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700',
    'Physical Education': isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-700',
    Biology: isDark ? 'bg-lime-500/20 text-lime-300' : 'bg-lime-100 text-lime-700',
    Economics: isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700',
  };

  const cardClass = `backdrop-blur-lg rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`;
  const inputClass = `w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-400 ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-900'}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>📝 Study Notes</h1>
          <p className={`mt-1 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Keep your notes organized by subject</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingNote(null); setFormData({ title: '', content: '', subject: subjects[0] }); }} className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity">
          <i className="fas fa-plus mr-2"></i>New Note
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <i className={`fas fa-search absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}></i>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notes..." className={`${inputClass} pl-10 ${isDark ? 'placeholder-gray-500' : 'placeholder-gray-400'}`} />
        </div>
        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className={inputClass}>
          <option value="all" className="bg-slate-800">All Subjects</option>
          {subjects.map((s) => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className={cardClass}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{editingNote ? 'Edit Note' : 'New Note'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Newton's Laws of Motion" className={`${inputClass} ${isDark ? 'placeholder-gray-500' : 'placeholder-gray-400'}`} />
              </div>
              <div>
                <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Subject</label>
                <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputClass}>
                  {subjects.map((s) => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Content</label>
              <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your notes here..." rows={8} className={`${inputClass} resize-none ${isDark ? 'placeholder-gray-500' : 'placeholder-gray-400'}`} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity">{editingNote ? 'Update Note' : 'Save Note'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingNote(null); }} className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className={`group rounded-2xl border p-5 transition-all ${isDark ? 'bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${subjectColors[note.subject] || 'bg-gray-500/20 text-gray-300'}`}>{note.subject}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => handleEdit(note)} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}><i className="fas fa-edit text-xs"></i></button>
                  <button onClick={() => handleDelete(note.id)} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-500'}`}><i className="fas fa-trash text-xs"></i></button>
                </div>
              </div>
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{note.title}</h3>
              <p className={`text-sm line-clamp-4 whitespace-pre-wrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{note.content || 'No content'}</p>
              <div className={`mt-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}><i className="fas fa-clock mr-1"></i>{new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
          <i className={`fas fa-sticky-note text-5xl mb-4 ${isDark ? 'text-purple-400/40' : 'text-purple-300'}`}></i>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{searchQuery ? 'No notes match your search' : 'No notes yet'}</p>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{searchQuery ? 'Try a different search term' : 'Create your first note to get started!'}</p>
        </div>
      )}
    </div>
  );
}
