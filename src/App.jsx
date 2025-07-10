import React, {useState, useEffect} from 'react';
import {
    Calendar,
    CheckCircle,
    Circle,
    Clock,
    Target,
    BookOpen,
    Video,
    Code,
    Database,
    Smartphone,
    MessageCircle,
    BarChart3,
    Download,
    Upload,
    Edit3,
    Save,
    X
} from 'lucide-react';

const CareerProgressTracker = () => {
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [tasks, setTasks] = useState({});
    const [milestones, setMilestones] = useState({});
    const [notes, setNotes] = useState({});
    const [editingNote, setEditingNote] = useState(null);
    const [tempNote, setTempNote] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/api/progress')
            .then(res => res.json())
            .then(data => {
                setTasks(data.tasks || {});
                setMilestones(data.milestones || {});
                setNotes(data.notes || {});
            })
            .catch(err => {
                console.error('Error loading progress:', err);
                const defaultTasks = {};
                const defaultMilestones = {};
                const defaultNotes = {};
                for (let week = 1; week <= 9; week++) {
                    defaultTasks[week] = {};
                    defaultMilestones[week] = {};
                    defaultNotes[week] = '';
                }
                setTasks(defaultTasks);
                setMilestones(defaultMilestones);
                setNotes(defaultNotes);
            });
    }, []);

    const weekData = {
        1: {
            title: "Week 1: Random Variables & Data Analysis",
            date: "July 11-17, 2025",
            hours: 17.5,
            days: [
                {
                    day: "Friday, July 11",
                    tasks: [
                        {
                            id: "rv_basics",
                            title: "Review Random Variables",
                            type: "theory",
                            hours: 1.5,
                            description: "Review discrete/continuous distributions, PDFs, expected values (ActEd Course Notes, Ch. 1-2). Solve 5 practice problems."
                        },
                        {
                            id: "r_install",
                            title: "Install & Learn R Basics",
                            type: "r",
                            hours: 1,
                            description: "Install R 3.6.1, follow CS1B R material for basic arithmetic and loops (IFoA CS1B Guide). Write simple R script."
                        }
                    ]
                },
                {
                    day: "Saturday, July 12",
                    tasks: [
                        {
                            id: "rv_variance",
                            title: "Variance & Covariance",
                            type: "theory",
                            hours: 1.5,
                            description: "Study variance, covariance, linear combinations (ActEd Course Notes, Ch. 2). Solve 5 problems on covariance."
                        },
                        {
                            id: "r_distributions",
                            title: "R: Distributions",
                            type: "r",
                            hours: 1,
                            description: "Use R to compute probabilities for binomial and normal distributions (DataCamp R Basics). Save R code."
                        }
                    ]
                },
                {
                    day: "Sunday, July 13",
                    tasks: [
                        {
                            id: "data_summary",
                            title: "Data Summarization",
                            type: "theory",
                            hours: 1.5,
                            description: "Review measures of central tendency, dispersion (ActEd Course Notes, Ch. 3). Solve 5 summary stats problems."
                        },
                        {
                            id: "r_plots",
                            title: "R: Data Visualization",
                            type: "r",
                            hours: 1,
                            description: "Create histograms and boxplots in R (CS1B R material). Save plots."
                        }
                    ]
                },
                {
                    day: "Monday, July 14",
                    tasks: [
                        {
                            id: "correlation",
                            title: "Correlation Measures",
                            type: "theory",
                            hours: 1.5,
                            description: "Study correlation coefficients (ActEd Course Notes, Ch. 3 Scandal). Solve 3 correlation problems."
                        },
                        {
                            id: "r_correlation",
                            title: "R: Correlation Analysis",
                            type: "r",
                            hours: 1,
                            description: "Compute correlation in R (CS1B R material). Save R script."
                        }
                    ]
                },
                {
                    day: "Tuesday, July 15",
                    tasks: [
                        {
                            id: "data_practice",
                            title: "Data Analysis Practice",
                            type: "practice",
                            hours: 2,
                            description: "Complete 10 data analysis problems from ActEd X1 Assignment."
                        },
                        {
                            id: "r_data",
                            title: "R: Data Summarization",
                            type: "r",
                            hours: 0.5,
                            description: "Write R code for mean, median, and variance (CS1B R material)."
                        }
                    ]
                },
                {
                    day: "Wednesday, July 16",
                    tasks: [
                        {
                            id: "rv_practice",
                            title: "Random Variables Practice",
                            type: "practice",
                            hours: 2,
                            description: "Solve 10 problems on distributions and expected values (ActEd Course Notes)."
                        },
                        {
                            id: "r_practice_1",
                            title: "R Practice: Distributions",
                            type: "r",
                            hours: 0.5,
                            description: "Write R code for 3 distribution problems (CS1B R material)."
                        }
                    ]
                },
                {
                    day: "Thursday, July 17",
                    tasks: [
                        {
                            id: "mock_test_1",
                            title: "Week 1 Mock Test",
                            type: "practice",
                            hours: 2.5,
                            description: "Take CS1A mock test (ActEd X2 Assignment, 80 marks, 2.75h). Log score."
                        }
                    ]
                }
            ],
            milestones: [
                "Reviewed random variables and data analysis topics",
                "R basics and distribution calculations completed",
                "Completed Week 1 mock test and practice problems"
            ]
        },
        2: {
            title: "Week 2: Statistical Inference & Regression",
            date: "July 18-24, 2025",
            hours: 17.5,
            days: [
                {
                    day: "Friday, July 18",
                    tasks: [
                        {
                            id: "inference_basics",
                            title: "Statistical Inference Basics",
                            type: "theory",
                            hours: 1.5,
                            description: "Study hypothesis testing, confidence intervals (ActEd Course Notes, Ch. 4). Solve 5 problems."
                        },
                        {
                            id: "r_inference",
                            title: "R: Hypothesis Testing",
                            type: "r",
                            hours: 1,
                            description: "Perform t-tests in R (CS1B R material). Save R code."
                        }
                    ]
                },
                {
                    day: "Saturday, July 19",
                    tasks: [
                        {
                            id: "inference_advanced",
                            title: "Advanced Inference",
                            type: "theory",
                            hours: 1.5,
                            description: "Study p-values, power of tests (ActEd Course Notes, Ch. 4). Solve 5 problems."
                        },
                        {
                            id: "r_confidence",
                            title: "R: Confidence Intervals",
                            type: "r",
                            hours: 1,
                            description: "Compute confidence intervals in R (CS1B R material). Save R code."
                        }
                    ]
                },
                {
                    day: "Sunday, July 20",
                    tasks: [
                        {
                            id: "regression_basics",
                            title: "Linear Regression",
                            type: "theory",
                            hours: 1.5,
                            description: "Study simple linear regression (ActEd Course Notes, Ch. 5). Solve 5 regression problems."
                        },
                        {
                            id: "r_regression",
                            title: "R: Linear Regression",
                            type: "r",
                            hours: 1,
                            description: "Run linear regression in R (CS1B R material). Save R code and output."
                        }
                    ]
                },
                {
                    day: "Monday, July 21",
                    tasks: [
                        {
                            id: "glm_basics",
                            title: "Generalized Linear Models",
                            type: "theory",
                            hours: 1.5,
                            description: "Study GLMs (ActEd Course Notes, Ch. 5). Solve 5 GLM problems."
                        },
                        {
                            id: "r_glm",
                            title: "R: GLMs",
                            type: "r",
                            hours: 1,
                            description: "Run GLM in R (CS1B R material). Save R code and output."
                        }
                    ]
                },
                {
                    day: "Tuesday, July 22",
                    tasks: [
                        {
                            id: "regression_practice",
                            title: "Regression Practice",
                            type: "practice",
                            hours: 2,
                            description: "Complete 10 regression problems from ActEd X3 Assignment."
                        },
                        {
                            id: "r_practice_2",
                            title: "R Practice: Regression",
                            type: "r",
                            hours: 0.5,
                            description: "Write R code for 3 regression problems (CS1B R material)."
                        }
                    ]
                },
                {
                    day: "Wednesday, July 23",
                    tasks: [
                        {
                            id: "inference_practice",
                            title: "Inference Practice",
                            type: "practice",
                            hours: 2,
                            description: "Complete 10 inference problems from ActEd X4 Assignment."
                        },
                        {
                            id: "r_practice_3",
                            title: "R Practice: Inference",
                            type: "r",
                            hours: 0.5,
                            description: "Write R code for 3 inference problems (CS1B R material)."
                        }
                    ]
                },
                {
                    day: "Thursday, July 24",
                    tasks: [
                        {
                            id: "mock_test_2",
                            title: "Week 2 Mock Test",
                            type: "practice",
                            hours: 2.5,
                            description: "Take CS1A mock test (ActEd Mock Exam, 100 marks, 3.25h). Log score and review weak areas."
                        }
                    ]
                }
            ],
            milestones: [
                "Completed statistical inference and regression topics",
                "R code for hypothesis testing, confidence intervals, and regression",
                "Completed Week 2 mock test and practice problems"
            ]
        },
        3: {
            title: "Week 3: Bayesian Statistics & Exam Prep",
            date: "July 25-31, 2025",
            hours: 17.5,
            days: [
                {
                    day: "Friday, July 25",
                    tasks: [
                        {
                            id: "bayes_basics",
                            title: "Bayesian Statistics Basics",
                            type: "theory",
                            hours: 1.5,
                            description: "Study Bayesian concepts, priors, posteriors (ActEd Course Notes, Ch. 6). Solve 5 problems."
                        },
                        {
                            id: "r_bayes",
                            title: "R: Bayesian Analysis",
                            type: "r",
                            hours: 1,
                            description: "Perform Bayesian analysis in R (CS1B R material). Save R code."
                        }
                    ]
                },
                {
                    day: "Saturday, July 26",
                    tasks: [
                        {
                            id: "bayes_advanced",
                            title: "Advanced Bayesian Statistics",
                            type: "theory",
                            hours: 1.5,
                            description: "Study Bayesian inference (ActEd Course Notes, Ch. 6). Solve 5 advanced problems."
                        },
                        {
                            id: "r_bayes_practice",
                            title: "R: Bayesian Practice",
                            type: "r",
                            hours: 1,
                            description: "Write R code for 3 Bayesian problems (CS1B R material)."
                        }
                    ]
                },
                {
                    day: "Sunday, July 27",
                    tasks: [
                        {
                            id: "full_review",
                            title: "Full Syllabus Review",
                            type: "theory",
                            hours: 2,
                            description: "Review all CS1A topics (ActEd Revision Notes). Summarize key formulas."
                        },
                        {
                            id: "r_review",
                            title: "R Code Review",
                            type: "r",
                            hours: 0.5,
                            description: "Review and optimize R code from previous tasks."
                        }
                    ]
                },
                {
                    day: "Monday, July 28",
                    tasks: [
                        {
                            id: "cs1a_mock",
                            title: "CS1A Full Mock Exam",
                            type: "practice",
                            hours: 3.25,
                            description: "Take full CS1A mock exam (ActEd Mock Exam, 100 marks). Log score and weak areas."
                        }
                    ]
                },
                {
                    day: "Tuesday, July 29",
                    tasks: [
                        {
                            id: "cs1b_mock",
                            title: "CS1B Full Mock Exam",
                            type: "practice",
                            hours: 1.75,
                            description: "Take CS1B R-based mock exam (ActEd Mock Exam, 100 marks). Log score and weak areas."
                        }
                    ]
                },
                {
                    day: "Wednesday, July 30",
                    tasks: [
                        {
                            id: "weak_area_review",
                            title: "Weak Area Review",
                            type: "theory",
                            hours: 2,
                            description: "Review weak topics from mock exams (ActEd Revision Notes). Solve 10 targeted problems."
                        },
                        {
                            id: "r_weak_area",
                            title: "R: Weak Area Practice",
                            type: "r",
                            hours: 0.5,
                            description: "Write R code for 3 weak area problems (CS1B R material)."
                        }
                    ]
                },
                {
                    day: "Thursday, July 31",
                    tasks: [
                        {
                            id: "final_mock",
                            title: "Final CS1A & CS1B Mock",
                            type: "practice",
                            hours: 3.5,
                            description: "Take combined CS1A & CS1B mock exam (ActEd AMP, 100 marks each). Log final score and confirm exam readiness."
                        }
                    ]
                }
            ],
            milestones: [
                "Completed Bayesian statistics and full syllabus review",
                "R code for Bayesian analysis completed",
                "Completed CS1A & CS1B mock exams and weak area review",
                "Exam readiness confirmed"
            ]
        }
    };

    const getTypeIcon = (type) => {
        const icons = {
            flutter: <Smartphone className="w-4 h-4 text-blue-500"/>,
            java: <Code className="w-4 h-4 text-orange-500"/>,
            react: <Code className="w-4 h-4 text-cyan-500"/>,
            postgres: <Database className="w-4 h-4 text-blue-600"/>,
            nav: <BookOpen className="w-4 h-4 text-purple-500"/>,
            client: <Video className="w-4 h-4 text-green-500"/>,
            portfolio: <Target className="w-4 h-4 text-pink-500"/>
        };
        return icons[type] || <Circle className="w-4 h-4 text-gray-500"/>;
    };

    const getTypeColor = (type) => {
        const colors = {
            flutter: 'bg-blue-50 border-blue-200',
            java: 'bg-orange-50 border-orange-200',
            react: 'bg-cyan-50 border-cyan-200',
            postgres: 'bg-blue-50 border-blue-600',
            nav: 'bg-purple-50 border-purple-200',
            client: 'bg-green-50 border-green-200',
            portfolio: 'bg-pink-50 border-pink-200'
        };
        return colors[type] || 'bg-gray-50 border-gray-200';
    };

    const toggleTask = (weekNum, taskId) => {
        setTasks(prev => {
            const newTasks = {
                ...prev,
                [weekNum]: {
                    ...prev[weekNum],
                    [taskId]: !prev[weekNum]?.[taskId]
                }
            };
            fetch('http://localhost:3001/api/save-progress', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({tasks: newTasks, milestones, notes})
            }).catch(err => console.error('Error saving progress:', err));
            return newTasks;
        });
    };

    const toggleMilestone = (weekNum, milestoneIndex) => {
        setMilestones(prev => {
            const newMilestones = {
                ...prev,
                [weekNum]: {
                    ...prev[weekNum],
                    [milestoneIndex]: !prev[weekNum]?.[milestoneIndex]
                }
            };
            fetch('http://localhost:3001/api/save-progress', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({tasks, milestones: newMilestones, notes})
            }).catch(err => console.error('Error saving progress:', err));
            return newMilestones;
        });
    };

    const getWeekProgress = (weekNum) => {
        const week = weekData[weekNum];
        if (!week) return 0;
        const allTasks = week.days.flatMap(day => day.tasks);
        const completedTasks = allTasks.filter(task => tasks[weekNum]?.[task.id]).length;
        return allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0;
    };

    const getOverallProgress = () => {
        const totalWeeks = Object.keys(weekData).length;
        const totalProgress = Object.keys(weekData).reduce((sum, weekNum) => {
            return sum + getWeekProgress(parseInt(weekNum));
        }, 0);
        return totalProgress / totalWeeks;
    };

    const exportProgress = () => {
        fetch('http://localhost:3001/api/export-progress')
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'career-progress-backup.json';
                a.click();
                URL.revokeObjectURL(url);
            })
            .catch(err => console.error('Error exporting progress:', err));
    };

    const importProgress = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                fetch('http://localhost:3001/api/import-progress', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })
                    .then(res => res.json())
                    .then(data => {
                        setTasks(data.tasks);
                        setMilestones(data.milestones);
                        setNotes(data.notes);
                    })
                    .catch(err => console.error('Error importing progress:', err));
            } catch (err) {
                console.error('Invalid JSON file:', err);
            }
        };
        reader.readAsText(file);
    };

    const startEditingNote = (weekNum) => {
        setEditingNote(weekNum);
        setTempNote(notes[weekNum] || '');
    };

    const saveNote = (weekNum) => {
        setNotes(prev => {
            const newNotes = {
                ...prev,
                [weekNum]: tempNote
            };
            fetch('http://localhost:3001/api/save-progress', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({tasks, milestones, notes: newNotes})
            }).catch(err => console.error('Error saving progress:', err));
            return newNotes;
        });
        setEditingNote(null);
        setTempNote('');
    };

    const cancelEditingNote = () => {
        setEditingNote(null);
        setTempNote('');
    };

    const currentWeek = weekData[selectedWeek];

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Career Growth Plan Tracker</h1>
                        <p className="text-gray-600 mt-2">SACCO Development & BC Integration • July 8 - September 8,
                            2025</p>
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
                            <Download className="w-4 h-4"/>
                            <span>Export Progress</span>
                        </button>
                        {/*<label className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">*/}
                        {/*    <Upload className="w-4 h-4" />*/}
                        {/*    <span>Import Progress</span>*/}
                        {/*    <input type="file" accept=".json" onChange={importProgress} className="hidden" />*/}
                        {/*</label>*/}
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
                                        style={{width: `${progress}%`}}
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
                    <Calendar className="w-4 h-4"/>
                    <span>{currentWeek.date}</span>
                  </span>
                                    <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4"/>
                    <span>{currentWeek.hours} hours</span>
                  </span>
                                </p>
                            </div>
                            <div className="text-right">
                                <div
                                    className="text-2xl font-bold text-blue-600">{Math.round(getWeekProgress(selectedWeek))}%
                                </div>
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
                                                            <CheckCircle className="w-5 h-5 text-green-600"/>
                                                        ) : (
                                                            <Circle className="w-5 h-5 text-gray-400"/>
                                                        )}
                                                    </button>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            {getTypeIcon(task.type)}
                                                            <span className={`font-medium ${
                                                                tasks[selectedWeek]?.[task.id] ? 'line-through text-gray-500' : 'text-gray-800'
                                                            }`}>
                                {task.title}
                              </span>
                                                            <span
                                                                className="text-sm text-gray-500">({task.hours}h)</span>
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
                            <Target className="w-5 h-5 text-blue-600"/>
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
                                            <CheckCircle className="w-5 h-5 text-green-600"/>
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-400"/>
                                        )}
                                    </button>
                                    <span className={`text-sm ${
                                        milestones[selectedWeek]?.[index] ? 'line-through text-gray-500' : 'text-gray-700'
                                    }`}>
                    {milestone}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                <MessageCircle className="w-5 h-5 text-purple-600"/>
                                <span>Week {selectedWeek} Notes</span>
                            </h3>
                            {editingNote !== selectedWeek && (
                                <button
                                    onClick={() => startEditingNote(selectedWeek)}
                                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                                >
                                    <Edit3 className="w-4 h-4"/>
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
                                        <Save className="w-4 h-4"/>
                                        <span>Save</span>
                                    </button>
                                    <button
                                        onClick={cancelEditingNote}
                                        className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                    >
                                        <X className="w-4 h-4"/>
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
                            <BarChart3 className="w-5 h-5 text-green-600"/>
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
};

export default CareerProgressTracker;