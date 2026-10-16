import React, { useState, useEffect, useRef } from 'react';

type PomodoroTimerProps = {
  addSession: (subject: string, duration: number) => void;
  subjects: string[];
  theme: 'dark' | 'light';
};

export default function PomodoroTimer({ addSession, subjects, theme }: PomodoroTimerProps) {
  const isDark = theme === 'dark';
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const durations = { focus: customMinutes * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      addSession(selectedSubject, customMinutes * 60);
      const newCount = sessionsCompleted + 1;
      setSessionsCompleted(newCount);
      if (newCount % 4 === 0) { setMode('longBreak'); setTimeLeft(durations.longBreak); }
      else { setMode('shortBreak'); setTimeLeft(durations.shortBreak); }
    } else {
      setMode('focus');
      setTimeLeft(durations.focus);
    }
  };

  const handleReset = () => { setIsRunning(false); setTimeLeft(durations[mode]); };

  const handleModeChange = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false); setMode(newMode); setTimeLeft(durations[newMode]);
  };

  const handleCustomTime = () => { setIsRunning(false); setTimeLeft(customMinutes * 60); };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const cardClass = `backdrop-blur-lg rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>⏱️ Study Timer</h1>
        <p className={`mt-1 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Stay focused with the Pomodoro technique</p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 justify-center">
        {(['focus', 'shortBreak', 'longBreak'] as const).map((m) => (
          <button key={m} onClick={() => handleModeChange(m)} className={`px-5 py-2.5 rounded-xl font-medium transition-all ${mode === m ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' : (isDark ? 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20' : 'bg-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-300')}`}>
            {m === 'focus' ? '🎯 Focus' : m === 'shortBreak' ? '☕ Short Break' : '🌴 Long Break'}
          </button>
        ))}
      </div>

      {/* Subject Selector */}
      <div className="flex justify-center">
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={`border rounded-xl px-4 py-2 focus:outline-none focus:border-purple-400 ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
          {subjects.map((s) => <option key={s} value={s} className="bg-slate-800">📚 {s}</option>)}
        </select>
      </div>

      {/* Timer Display */}
      <div className="flex justify-center">
        <div className="relative w-72 h-72">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="120" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="8" fill="none" />
            <circle cx="130" cy="130" r="120" stroke="url(#gradient)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={`text-6xl font-bold font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <p className={`mt-2 text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
              {mode === 'focus' ? '🎯 Focus Time' : mode === 'shortBreak' ? '☕ Short Break' : '🌴 Long Break'}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>📚 {selectedSubject}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button onClick={() => setIsRunning(!isRunning)} className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${isRunning ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90 shadow-lg shadow-green-500/30'}`}>
          {isRunning ? <><i className="fas fa-pause mr-2"></i>Pause</> : <><i className="fas fa-play mr-2"></i>Start</>}
        </button>
        <button onClick={handleReset} className={`px-6 py-3 rounded-xl font-medium transition-colors ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          <i className="fas fa-redo mr-2"></i>Reset
        </button>
      </div>

      {/* Custom Duration */}
      <div className="flex justify-center items-center gap-3">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Focus Duration:</span>
        <input type="range" min="5" max="90" step="5" value={customMinutes} onChange={(e) => setCustomMinutes(Number(e.target.value))} className="w-32 accent-purple-500" />
        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{customMinutes} min</span>
        <button onClick={handleCustomTime} className={`px-3 py-1 rounded-lg text-sm ${isDark ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>Set</button>
      </div>

      {/* Session Counter */}
      <div className="flex justify-center">
        <div className={cardClass + ' text-center'}>
          <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sessions Completed Today</p>
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: Math.min(sessionsCompleted, 8) }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
            ))}
            {sessionsCompleted === 0 && <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No sessions yet — start studying!</p>}
          </div>
          <p className={`font-bold text-2xl mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{sessionsCompleted}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{sessionsCompleted * customMinutes} minutes of focused study</p>
        </div>
      </div>

      {/* Tips */}
      <div className={cardClass}>
        <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>💡 Pomodoro Tips</h3>
        <ul className="space-y-2 text-sm">
          {['Work for 25 minutes, then take a 5-minute break', 'After 4 focus sessions, take a longer 15-minute break', 'Remove distractions during focus time (phone on silent)', 'Use breaks to stretch, drink water, or rest your eyes'].map((tip, i) => (
            <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <i className={`fas fa-check mt-1 ${isDark ? 'text-purple-400' : 'text-purple-500'}`}></i><span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
