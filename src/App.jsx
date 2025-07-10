import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css'; // Assuming you have styles

function App() {
  const [userId, setUserId] = useState('');
  const [isUserIdSet, setIsUserIdSet] = useState(false);
  const [tasks, setTasks] = useState({});
  const [milestones, setMilestones] = useState({});
  const [notes, setNotes] = useState({});
  const [studyPlan] = useState([
    { id: 'rv', name: 'Random Variables', category: 'Statistics' },
    { id: 'si', name: 'Statistical Inference', category: 'Statistics' },
    { id: 'reg', name: 'Regression', category: 'Statistics' },
    { id: 'bayes', name: 'Bayesian Statistics', category: 'Statistics' },
    { id: 'r', name: 'R Programming', category: 'Programming' },
  ]);

  // Load userId from localStorage or generate new one
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
    fetch(`/api/progress?userId=${encodeURIComponent(userId)}`)
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
    fetch('/api/save-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message))
      .catch((err) => console.error('Error saving progress:', err));
  };

  // Toggle task
  const toggleTask = (taskId) => {
    setTasks((prev) => {
      const newTasks = { ...prev, [taskId]: !prev[taskId] };
      saveProgress({ ...tasks, [taskId]: !prev[taskId] }, milestones, notes);
      return newTasks;
    });
  };

  // Add note
  const addNote = (note) => {
    setNotes((prev) => {
      const newNotes = { ...prev, [Date.now()]: note };
      saveProgress(tasks, milestones, newNotes);
      return newNotes;
    });
  };

  // Export progress
  const exportProgress = () => {
    window.location.href = `/api/export-progress?userId=${encodeURIComponent(userId)}`;
  };

  // Import progress
  const importProgress = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        fetch('/api/import-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, ...importedData }),
        })
          .then((res) => res.json())
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

  if (!isUserIdSet) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">CS1 Progress Tracker</h1>
        <form onSubmit={handleSetUserId} className="mb-4">
          <label htmlFor="userIdInput" className="block mb-2">
            Enter your username (or leave blank for a random ID):
          </label>
          <input
            id="userIdInput"
            type="text"
            className="border p-2 mr-2"
            placeholder="e.g., user1"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Start Tracking
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CS1 Progress Tracker ({userId})</h1>
      <h2 className="text-xl mb-2">Study Plan</h2>
      <ul className="list-disc pl-5 mb-4">
        {studyPlan.map((item) => (
          <li key={item.id}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={!!tasks[item.id]}
                onChange={() => toggleTask(item.id)}
                className="mr-2"
              />
              {item.name} ({item.category})
            </label>
          </li>
        ))}
      </ul>
      <h2 className="text-xl mb-2">Notes</h2>
      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Add a note..."
        onBlur={(e) => e.target.value && addNote(e.target.value)}
      />
      <ul className="list-disc pl-5 mb-4">
        {Object.entries(notes).map(([id, note]) => (
          <li key={id}>{note}</li>
        ))}
      </ul>
      <div className="flex space-x-2">
        <button
          onClick={exportProgress}
          className="bg-green-500 text-white p-2 rounded"
        >
          Export Progress
        </button>
        <input
          type="file"
          accept=".json"
          onChange={importProgress}
          className="border p-2"
        />
      </div>
    </div>
  );
}

export default App;