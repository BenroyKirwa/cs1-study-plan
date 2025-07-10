import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Download, Calendar, Clock, CheckCircle, Circle, Target, MessageCircle, Edit3, Save, X, BarChart3, BookOpen, Code, Upload, Smartphone, Database, Video } from 'lucide-react';

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
        {
          day: 'Monday',
          tasks: [
            { id: 'flutter1', title: 'Flutter Setup', description: 'Install Flutter and set up IDE', hours: 4, type: 'flutter' },
            { id: 'java1', title: 'Java Basics', description: 'Review Java syntax for BC integration', hours: 3, type: 'java' },
          ],
        },
        {
          day: 'Tuesday',
          tasks: [
            { id: 'react1', title: 'React Components', description: 'Build basic React components', hours: 4, type: 'react' },
          ],
        },
      ],
      milestones: ['Complete Flutter installation', 'Understand Java BC integration'],
    },
    2: {
      title: 'Week 2: Integration',
      date: 'July 15 - July 21, 2025',
      hours: 40,
      days: [
        {
          day: 'Monday',
          tasks: [
            { id: 'postgres1', title: 'PostgreSQL Setup', description: 'Set up PostgreSQL and write basic queries', hours: 4, type: 'postgres' },
            { id: 'client1', title: 'Client Meeting Prep', description: 'Prepare for SACCO client meeting', hours: 2, type: 'client' },
          ],
        },
      ],
      milestones: ['Run PostgreSQL queries', 'Conduct client meeting'],
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
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
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
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => console.log(data.message))
      .catch((err) => console.error('Error saving progress:', err));
  };

  // Export progress
  const exportProgress = () => {
    window.location.href = `https://cs1-study-plan-production.up.railway.app/api/export-progress?userId=${encodeURIComponent(userId)}`;
  };

  // Import progress
  const importProgress = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        fetch('https://cs1-study-plan-production.up.railway.app/api/import-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, ...importedData }),
        })
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
          .then((data) => {
            setTasks(data.tasks || {});
            setMilestones(data.milestones || {});
            setNotes(data.notes || {});
          })
          .catch((err) => console.error('Error importing progress:', err));
      } catch (err) {
        console.error('Invalid JSON file:', err);
      }
    };
    reader.readAsText(file);
  };

  // Toggle task
  const toggleTask = (weekNum, taskId) => {
    setTasks((prev) => {
      const newTasks = {
        ...prev,
        [weekNum]: {
          ...prev[weekNum],
          [taskId]: !prev[weekNum]?.[taskId],
        },
      };
      saveProgress();
      return newTasks;
    });
  };

  // Toggle milestone
  const toggleMilestone = (weekNum, milestoneIndex) => {
    setMilestones((prev) => {
      const newMilestones = {
        ...prev,
        [weekNum]: {
          ...prev[weekNum],
          [milestoneIndex]: !prev[weekNum]?.[milestoneIndex],
        },
      };
      saveProgress();
      return newMilestones;
    });
  };

  // Note editing
  const startEditingNote = (weekNum) => {
    setEditingNote(weekNum);
    setTempNote(notes[weekNum] || '');
  };

  const saveNote = (weekNum) => {
    setNotes((prev) => {
      const newNotes = { ...prev, [weekNum]: tempNote };
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
  const getWeekProgress = (weekNum) => {
    const week = weekData[weekNum];
    if (!week) return 0;
    const allTasks = week.days.flatMap((day) => day.tasks);
    const completedTasks = allTasks.filter((task) => tasks[weekNum]?.[task.id]).length;
    return allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0;
  };

  const getOverallProgress = () => {
    const totalWeeks = Object.keys(weekData).length;
    const totalProgress = Object.keys(weekData).reduce((sum, weekNum) => {
      return sum + getWeekProgress(parseInt(weekNum));
    }, 0);
    return totalWeeks > 0 ? totalProgress / totalWeeks : 0;
  };

  // Task type utilities
  const getTypeIcon = (type) => {
    const icons = {
      flutter: <Smartphone className="w-4 h-4 text-blue-500" />,
      java: <Code className="w-4 h-4 text-orange-500" />,
      react: <Code className="w-4 h-4 text-cyan-500" />,
      postgres: <Database className="w-4 h-4 text-blue-600" />,
      nav: <BookOpen className="w-4 h-4 text-purple-500" />,
      client: <Video className="w-4 h-4 text-green-500" />,
      portfolio: <Target className="w-4 h-4 text-pink-500" />,
    };
    return icons[type] || <Circle className="w-4 h-4 text-gray-500" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      flutter: 'bg-blue-50 border-blue-200',
      java: 'bg-orange-50 border-orange-200',
      react: 'bg-cyan-50 border-cyan-200',
      postgres: 'bg-blue-50 border-blue-600',
      nav: 'bg-purple-50 border-purple-200',
      client: 'bg-green-50 border-green-200',
      portfolio: 'bg-pink-50 border-pink-200',
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
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