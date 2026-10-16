import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import Tasks from './components/Tasks';
import PomodoroTimer from './components/PomodoroTimer';
import Notes from './components/Notes';
import Progress from './components/Progress';
import Sidebar from './components/Sidebar';

export type Task = {
  id: string;
  title: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  createdAt: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
};

export type StudySession = {
  id: string;
  subject: string;
  duration: number;
  date: string;
};

export type ScheduleItem = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  topic: string;
};

const SUBJECTS = [
  'Physics',
  'Chemistry',
  'Mathematics',
  'English',
  'Computer Science',
  'Physical Education',
  'Biology',
  'Economics',
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('studyTheme');
    return (saved as 'dark' | 'light') || 'dark';
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('studyTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('studyNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('studySessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('studySchedule');
    return saved ? JSON.parse(saved) : getDefaultSchedule();
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('studyTheme', theme);
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studyNotes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('studySchedule', JSON.stringify(schedule));
  }, [schedule]);

  const addSession = useCallback((subject: string, duration: number) => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject,
      duration,
      date: new Date().toISOString().split('T')[0],
    };
    setSessions((prev) => [...prev, newSession]);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard tasks={tasks} sessions={sessions} schedule={schedule} theme={theme} />;
      case 'schedule':
        return <Schedule schedule={schedule} setSchedule={setSchedule} subjects={SUBJECTS} theme={theme} />;
      case 'tasks':
        return <Tasks tasks={tasks} setTasks={setTasks} subjects={SUBJECTS} theme={theme} />;
      case 'timer':
        return <PomodoroTimer addSession={addSession} subjects={SUBJECTS} theme={theme} />;
      case 'notes':
        return <Notes notes={notes} setNotes={setNotes} subjects={SUBJECTS} theme={theme} />;
      case 'progress':
        return <Progress sessions={sessions} tasks={tasks} subjects={SUBJECTS} theme={theme} />;
      default:
        return <Dashboard tasks={tasks} sessions={sessions} schedule={schedule} theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50'
    }`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'text-white bg-white/10 hover:bg-white/20' : 'text-gray-900 bg-gray-200 hover:bg-gray-300'}`}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>StudyHub</h1>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'text-white bg-white/10 hover:bg-white/20' : 'text-gray-900 bg-gray-200 hover:bg-gray-300'}`}
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon text-indigo-600'} text-lg`}></i>
            </button>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function getDefaultSchedule(): ScheduleItem[] {
  return [
    { id: '1', day: 'Monday', startTime: '06:00', endTime: '07:30', subject: 'Physics', topic: 'Mechanics' },
    { id: '2', day: 'Monday', startTime: '08:00', endTime: '09:30', subject: 'Mathematics', topic: 'Calculus' },
    { id: '3', day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'Chemistry', topic: 'Organic Chemistry' },
    { id: '4', day: 'Tuesday', startTime: '06:00', endTime: '07:30', subject: 'Chemistry', topic: 'Physical Chemistry' },
    { id: '5', day: 'Tuesday', startTime: '08:00', endTime: '09:30', subject: 'English', topic: 'Literature' },
    { id: '6', day: 'Tuesday', startTime: '10:00', endTime: '11:00', subject: 'Computer Science', topic: 'Python Programming' },
    { id: '7', day: 'Wednesday', startTime: '06:00', endTime: '07:30', subject: 'Mathematics', topic: 'Algebra' },
    { id: '8', day: 'Wednesday', startTime: '08:00', endTime: '09:30', subject: 'Physics', topic: 'Thermodynamics' },
    { id: '9', day: 'Wednesday', startTime: '10:00', endTime: '11:00', subject: 'Physical Education', topic: 'Fitness Training' },
    { id: '10', day: 'Thursday', startTime: '06:00', endTime: '07:30', subject: 'Physics', topic: 'Waves & Optics' },
    { id: '11', day: 'Thursday', startTime: '08:00', endTime: '09:30', subject: 'Chemistry', topic: 'Inorganic Chemistry' },
    { id: '12', day: 'Thursday', startTime: '10:00', endTime: '11:00', subject: 'Mathematics', topic: 'Trigonometry' },
    { id: '13', day: 'Friday', startTime: '06:00', endTime: '07:30', subject: 'English', topic: 'Grammar & Writing' },
    { id: '14', day: 'Friday', startTime: '08:00', endTime: '09:30', subject: 'Computer Science', topic: 'Data Structures' },
    { id: '15', day: 'Friday', startTime: '10:00', endTime: '11:00', subject: 'Physics', topic: 'Electrostatics' },
    { id: '16', day: 'Saturday', startTime: '09:00', endTime: '11:00', subject: 'Mathematics', topic: 'Practice Problems' },
    { id: '17', day: 'Saturday', startTime: '11:30', endTime: '13:00', subject: 'Chemistry', topic: 'Revision' },
    { id: '18', day: 'Sunday', startTime: '09:00', endTime: '11:00', subject: 'Physics', topic: 'Revision & Mock Tests' },
    { id: '19', day: 'Sunday', startTime: '14:00', endTime: '15:30', subject: 'English', topic: 'Reading Comprehension' },
  ];
}
