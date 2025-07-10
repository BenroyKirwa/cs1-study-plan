import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Download, Calendar, Clock, CheckCircle, Circle, Target, MessageCircle, Edit3, Save, X, BarChart3 } from 'lucide-react';

function App() {
  const [userId, setUserId] = useState('');
  const [isUserIdSet, setIsUserIdSet] = useState(false);
  const [tasks, setTasks] = useState({});
  const [milestones, setMilestones] = useState({});
  const [notes, setNotes] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [editingNote, setEditingNote] = useState(null);
  const [tempNote, setTempNote] = useState('');

  const weekData = {
    1: {
      title: 'Week 1: Foundation',
      date: 'July 8 - July 14, 2025',
      hours: 40,
      days: [
        { day: 'Monday', tasks: [
          { id: 'rv1', title: 'Introduction to Random Variables', description: 'Study discrete and continuous random variables', hours: 4, type: 'study' },
          { id: 'r1', title: 'R Basics', description: 'Install R and learn basic syntax', hours: 3, type: 'coding' },
        ]},
        { day: 'Tuesday', tasks: [
          { id: 'rv2', title: 'Probability Distributions', description: 'Explore probability mass and density functions', hours: 4, type: 'study' },
        ]},
      ],
      milestones: ['Complete R installation', 'Understand random variable types'],
    },
    2: {
      title: 'Week 2: Statistical Inference',
      date: 'July 15 - July 21, 2025',
      hours: 40,
      days: [
        { day: 'Monday', tasks: [
          { id: 'si1', title: 'Hypothesis Testing', description: 'Learn null and alternative hypotheses', hours: 4, type: 'study' },
        ]},
      ],
      milestones: ['Master hypothesis testing concepts'],
    },
    // Add more weeks as needed
  };

  // Load userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsUserIdSet(true);
    }
  }, []);

  // Handle userId submission
  const handleSetUserId = (e) => {
    e.preventDefault();
    const inputUserId = e.target.elements.userIdInput.value.trim();
    if (inputUserId) {
      setUserId(inputUserId);
      localStorage.setItem('userId', inputUserId);
      setIsUserIdSet(true);
    } else {
      const newUserId = uuidv4();
      setUserId(newUserId);
      localStorage.setItem('userId', newUserId);
      setIsUserIdSet(true);
    }
  };

  // Load progress
  useEffect(() => {
    if (!isUserIdSet) return;
    fetch(`https://cs1-study-plan-production.up.railway.app/api/progress?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks || {});
        setMilestones(data.milestones || {});
        setNotes(data.notes || {});
      })
      .catch((err) => console.error('Error loading progress:', err));
  }, [userId, isUserIdSet]);

  // Save progress
  const saveProgress = () => {
    const progressData = { userId, tasks, milestones, notes };
    fetch('https://cs1-study-plan-production.up.railway.app/api/save-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message))
      .catch((err) => console.error('Error saving progress:', err));
  };

  // Toggle task
  const toggleTask = (week, taskId) => {
    setTasks((prev) => {
      const weekTasks = prev[week] || {};
      const newTasks = { ...prev, [week]: { ...weekTasks, [taskId]: !weekTasks[taskId] } };
      saveProgress();
      return newTasks;
    });
  };

  // Toggle milestone
  const toggleMilestone = (week, index) => {
    setMilestones((prev) => {
      const weekMilestones = prev[week] || {};
      const newMilestones = { ...prev, [week]: { ...weekMilestones, [index]: !weekMilestones[index] } };
      saveProgress();
      return newMilestones;
    });
  };

  // Note editing
  const startEditingNote = (week) => {
    setEditingNote(week);
    setTempNote(notes[week] || '');
  };

  const saveNote = (week) => {
    setNotes((prev) => {
      const newNotes = { ...prev, [week]: tempNote };
      saveProgress();
      return newNotes;
    });
    setEditingNote(null);
    setTempNote('');
  };

  const cancelEditingNote = () => {
    setEditingNote(null);
    setTempNote('');
  };

  // Progress calculations
  const getWeekProgress = (week) => {
    const weekTasks = weekData[week]?.days.flatMap((day) => day.tasks) || [];
    const completedTasks = weekTasks.filter((task) => tasks[week]?.[task.id]).length;
    return weekTasks.length ? (completedTasks / weekTasks.length) * 100 : 0;
  };

  const getOverallProgress = () => {
    const allTasks = Object.values(weekData).flatMap((week) => week.days.flatMap((day) => day.tasks));
    const completedTasks = allTasks.filter((task) => tasks[task.week]?.[task.id]).length;
    return allTasks.length ? (completedTasks / allTasks.length) * 100 : 0;
  };

  // Task type utilities
  const getTypeColor = (type) => {
    switch (type) {
      case 'study': return 'border-blue-100 bg-blue-50';
      case 'coding': return 'border-green-100 bg-green-50';
      default: return 'border-gray-100 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'study': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'coding': return <Code className="w-4 h-4 text-green-600" />;
      default: return null;
    }
  };

  if (!isUserIdSet) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">CS1 Progress Tracker</h1>
        <form onSubmit={handleSetUserId} className="mb-4">
          <label htmlFor="userIdInput" className="block mb-2 text-gray-600">
            Enter your username (or leave blank for a random ID):
          </label>
          <div className="flex space-x-2">
            <input
              id="userIdInput"
              type="text"
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., user1"
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              Start Tracking
            </button>
          </div>
        </form>
      </div>
    );
  }

  const currentWeek = weekData[selectedWeek] || weekData[1];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Career Growth Plan Tracker ({userId})</h1>
            <p className="text-gray-600 mt-2">SACCO Development & BC Integration • July 8 - September 8, 2025</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(getOverallProgress())}%</div>
              <div className="text-sm text-gray-500">Overall Progress</div>
            </div>
            <button
              onClick={exportProgress}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Progress</span>
            </button>
            <label className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import Progress</span>
              <input type="file" accept=".json" onChange={importProgress} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-9 gap-2 mb-6">
          {Object.entries(weekData).map(([weekNum, week]) => {
            const progress = getWeekProgress(parseInt(weekNum));
            return (
              <button
                key={weekNum}
                onClick={() => setSelectedWeek(parseInt(weekNum))}
                className={`p-3 rounded-lg border transition-all ${
                  selectedWeek === parseInt(weekNum)
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium text-gray-700 mb-1">Week {weekNum}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">{Math.round(progress)}%</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentWeek.title}</h2>
                <p className="text-gray-600 flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{currentWeek.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentWeek.hours} hours</span>
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{Math.round(getWeekProgress(selectedWeek))}%</div>
                <div className="text-sm text-gray-500">Week Progress</div>
              </div>
            </div>

            <div className="space-y-6">
              {currentWeek.days.map((day, dayIndex) => (
                <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">{day.day}</h3>
                  <div className="space-y-3">
                    {day.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`border rounded-lg p-3 transition-all ${getTypeColor(task.type)} ${
                          tasks[selectedWeek]?.[task.id] ? 'opacity-75' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => toggleTask(selectedWeek, task.id)}
                            className="mt-1 flex-shrink-0"
                          >
                            {tasks[selectedWeek]?.[task.id] ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {getTypeIcon(task.type)}
                              <span
                                className={`font-medium ${
                                  tasks[selectedWeek]?.[task.id] ? 'line-through text-gray-500' : 'text-gray-800'
                                }`}
                              >
                                {task.title}
                              </span>
                              <span className="text-sm text-gray-500">({task.hours}h)</span>
                            </div>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Week {selectedWeek} Milestones</span>
            </h3>
            <div className="space-y-3">
              {currentWeek.milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleMilestone(selectedWeek, index)}
                    className="mt-1 flex-shrink-0"
                  >
                    {milestones[selectedWeek]?.[index] ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <span
                    className={`text-sm ${
                      milestones[selectedWeek]?.[index] ? 'line-through text-gray-500' : 'text-gray-700'
                    }`}
                  >
                    {milestone}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <span>Week {selectedWeek} Notes</span>
              </h3>
              {editingNote !== selectedWeek && (
                <button
                  onClick={() => startEditingNote(selectedWeek)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            {editingNote === selectedWeek ? (
              <div className="space-y-3">
                <textarea
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Add your notes for this week..."
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveNote(selectedWeek)}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={cancelEditingNote}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                {notes[selectedWeek] || "No notes added yet. Click Edit to add notes."}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Progress Overview</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Flutter/Dart</span>
                <span className="text-sm font-medium text-blue-600">Mobile Development</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Java/BC</span>
                <span className="text-sm font-medium text-orange-600">USSD & Integration</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">React/TS</span>
                <span className="text-sm font-medium text-cyan-600">Frontend Development</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">PostgreSQL</span>
                <span className="text-sm font-medium text-blue-700">Database & Middleware</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">NAV/BC</span>
                <span className="text-sm font-medium text-purple-600">Client Support</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Client Communication</span>
                <span className="text-sm font-medium text-green-600">Soft Skills</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;