const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// Helper to get user-specific file path
const getProgressFilePath = (userId) => {
    return path.join(__dirname, `../progress-${userId}.json`);
};

// Load progress
app.get('/api/progress', async (req, res) => {
    const userId = req.query.userId || 'default'; // Use query param for simplicity
    const progressFilePath = getProgressFilePath(userId);
    try {
        const data = await fs.readFile(progressFilePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.json({ tasks: {}, milestones: {}, notes: {} });
        } else {
            console.error('Error reading progress:', err);
            res.status(500).json({ error: 'Failed to load progress' });
        }
    }
});

// Save progress
app.post('/api/save-progress', async (req, res) => {
    const userId = req.body.userId || 'default';
    const progressFilePath = getProgressFilePath(userId);
    try {
        const progressData = req.body;
        await fs.writeFile(progressFilePath, JSON.stringify(progressData, null, 2));
        res.json({ message: 'Progress saved successfully' });
    } catch (err) {
        console.error('Error saving progress:', err);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

// Export progress
app.get('/api/export-progress', async (req, res) => {
    const userId = req.query.userId || 'default';
    const progressFilePath = getProgressFilePath(userId);
    try {
        const data = await fs.readFile(progressFilePath, 'utf8');
        res.setHeader('Content-Disposition', `attachment; filename=career-progress-${userId}.json`);
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.json({ tasks: {}, milestones: {}, notes: {} });
        } else {
            console.error('Error exporting progress:', err);
            res.status(500).json({ error: 'Failed to export progress' });
        }
    }
});

// Import progress
app.post('/api/import-progress', async (req, res) => {
    const userId = req.body.userId || 'default';
    const progressFilePath = getProgressFilePath(userId);
    try {
        const progressData = req.body;
        await fs.writeFile(progressFilePath, JSON.stringify(progressData, null, 2));
        res.json(progressData);
    } catch (err) {
        console.error('Error importing progress:', err);
        res.status(500).json({ error: 'Failed to import progress' });
    }
});

// Catch-all route for React frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});