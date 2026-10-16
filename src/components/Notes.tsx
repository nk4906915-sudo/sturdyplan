import React, { useState } from 'react';
import { Note } from '../App';

type NotesProps = {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  subjects: string[];
};

export default function Notes({ notes, setNotes, subjects }: NotesProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: subjects[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id
            ? { ...note, title: formData.title, content: formData.content, subject: formData.subject }
            : note
        )
      );
      setEditingNote(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        subject: formData.subject,
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    setFormData({ title: '', content: '', subject: subjects[0] });
    setShowForm(false);
  };

  const handleEdit = (note: Note) => {
    setFormData({ title: note.title, content: note.content, subject: note.subject });
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const filteredNotes = notes
    .filter((note) => {
      if (subjectFilter === 'all') return true;
      return note.subject === subjectFilter;
    })
    .filter((note) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query)
      );
    });

  const subjectColors: Record<string, string> = {
    Physics: 'bg-blue-500/20 text-blue-300',
    Chemistry: 'bg-green-500/20 text-green-300',
    Mathematics: 'bg-purple-500/20 text-purple-300',
    English: 'bg-pink-500/20 text-pink-300',
    'Computer Science': 'bg-orange-500/20 text-orange-300',
    'Physical Education': 'bg-teal-500/20 text-teal-300',
    Biology: 'bg-lime-500/20 text-lime-300',
    Economics: 'bg-indigo-500/20 text-indigo-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📝 Study Notes</h1>
          <p className="text-purple-300 mt-1">Keep your notes organized by subject</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingNote(null);
            setFormData({ title: '', content: '', subject: subjects[0] });
          }}
          className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <i className="fas fa-plus mr-2"></i>
          New Note
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400"
        >
          <option value="all" className="bg-slate-800">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject} className="bg-slate-800">
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingNote ? 'Edit Note' : 'New Note'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Newton's Laws of Motion"
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
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your notes here..."
                rows={8}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                {editingNote ? 'Update Note' : 'Save Note'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingNote(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${subjectColors[note.subject] || 'bg-gray-500/20 text-gray-300'}`}>
                  {note.subject}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                  >
                    <i className="fas fa-edit text-xs"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{note.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-4 whitespace-pre-wrap">
                {note.content || 'No content'}
              </p>
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-gray-500 text-xs">
                  <i className="fas fa-clock mr-1"></i>
                  {new Date(note.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
          <i className="fas fa-sticky-note text-5xl text-purple-400/40 mb-4"></i>
          <p className="text-gray-400 text-lg">
            {searchQuery ? 'No notes match your search' : 'No notes yet'}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {searchQuery ? 'Try a different search term' : 'Create your first note to get started!'}
          </p>
        </div>
      )}
    </div>
  );
}
