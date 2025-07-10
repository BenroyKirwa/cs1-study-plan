const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;
const progressFilePath = path.join(__dirname, '../progress.json');

app.use(cors());
app.use(express.json());

// Load progress
app.get('/api/progress', async (req, res) => {
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
    try {
        const data = await fs.readFile(progressFilePath, 'utf8');
        res.setHeader('Content-Disposition', 'attachment; filename=career-progress-backup.json');
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
    try {
        const progressData = req.body;
        await fs.writeFile(progressFilePath, JSON.stringify(progressData, null, 2));
        res.json(progressData);
    } catch (err) {
        console.error('Error importing progress:', err);
        res.status(500).json({ error: 'Failed to import progress' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});