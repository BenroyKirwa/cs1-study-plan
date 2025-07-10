const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cs1_progress';
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// Connect to MongoDB
let db;
async function connectToMongo() {
  try {
    await client.connect();
    db = client.db('cs1_progress');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
connectToMongo();

app.get('/api/progress', async (req, res) => {
  const userId = req.query.userId || 'default';
  try {
    const collection = db.collection('progress');
    const progress = await collection.findOne({ userId }) || { tasks: {}, milestones: {}, notes: {} };
    res.json(progress);
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.post('/api/save-progress', async (req, res) => {
  const { userId, tasks, milestones, notes } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  try {
    const collection = db.collection('progress');
    await collection.updateOne(
      { userId },
      { $set: { userId, tasks, milestones, notes, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ message: 'Progress saved successfully' });
  } catch (err) {
    console.error('Error saving progress:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/export-progress', async (req, res) => {
  const userId = req.query.userId || 'default';
  try {
    const collection = db.collection('progress');
    const progress = await collection.findOne({ userId }) || { tasks: {}, milestones: {}, notes: {} };
    res.setHeader('Content-Disposition', `attachment; filename=career-progress-${userId}.json`);
    res.setHeader('Content-Type', 'application/json');
    res.json(progress);
  } catch (err) {
    console.error('Error exporting progress:', err);
    res.status(500).json({ error: 'Failed to export progress' });
  }
});

app.post('/api/import-progress', async (req, res) => {
  const { userId, tasks, milestones, notes } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  try {
    const collection = db.collection('progress');
    await collection.updateOne(
      { userId },
      { $set: { userId, tasks, milestones, notes, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ tasks, milestones, notes });
  } catch (err) {
    console.error('Error importing progress:', err);
    res.status(500).json({ error: 'Failed to import progress' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend server running at port ${port}`);
});