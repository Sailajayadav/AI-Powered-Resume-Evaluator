require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI ;
let db;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Connect to MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('job_portal');
  })
  .catch(error => console.error('MongoDB connection error:', error));

// Routes

// Get all job postings
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await db.collection('jobs').find({}).sort({ createdAt: -1 }).toArray();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new job posting
app.post('/api/jobs', async (req, res) => {
  try {
    const {
      job_id,
      title,
      description,
      requirements,
      location,
      salary,
      assessment  // ← from frontend form
    } = req.body;

    const jobData = {
      job_id,
      title,
      description,
      requirements: requirements || [],
      location: location || '',
      salary: salary || '',
      assessment: assessment || null,   // ✅ store assessment topics here
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save directly to MongoDB
    const result = await db.collection('jobs').insertOne(jobData);

    res.status(201).json({ message: 'Job posted successfully', jobId: result.insertedId });
  } catch (err) {
    console.error('Failed to post job:', err);
    res.status(500).json({ error: 'Failed to post job' });
  }
});

// Get specific job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await db.collection('jobs').findOne({ _id: new ObjectId(req.params.id) });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get applications for a specific job
app.get('/api/jobs/:jobId/applications', async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(typeof(jobId));
    // Find applications by job_id, sorted by match_score in descending order
    const applications = await db.collection('resumes')
      .find({ job_id: jobId })
      .sort({ match_score: -1 })
      .toArray();
    console.log(applications);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific application by ID
app.get('/api/applications/:id', async (req, res) => {
  try {
    const application = await db.collection('resume_collection')
      .findOne({ _id: new ObjectId(req.params.id) });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    console.log(application);
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit job application (for testing purposes)
app.post('/api/applications', upload.single('resume'), async (req, res) => {
  try {
    const { job_id, skills, classification, match_score } = req.body;
    
    // Get job details
    const job = await db.collection('jobs').findOne({ job_id });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const applicationData = {
      resume: req.file ? req.file.filename : null,
      classification: classification || 'Pending',
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      match_score: parseFloat(match_score) || 0,
      job_id,
      job_title: job.title,
      appliedAt: new Date()
    };

    const result = await db.collection('resume_collection').insertOne(applicationData);
    res.status(201).json({ _id: result.insertedId, ...applicationData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job posting
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const result = await db.collection('jobs').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});