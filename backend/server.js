const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const fs = require('fs');
const File = require('./models/File');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ensure storage folders exist
const dirs = ['./temp', './uploads'];
dirs.forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir); });

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes for Pages
app.get('/file/:id', (req, res) => res.sendFile(path.join(__dirname, '../frontend/download.html')));
app.get('/success.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/success.html')));

// API Routes
app.use('/api/files', require('./routes/fileRoutes'));

// 🧹 THE JANITOR: Runs every hour to delete expired files
cron.schedule('0 * * * *', async () => {
    console.log("🧹 Running hourly cleanup...");
    const expiredFiles = await File.find({ expiresAt: { $lt: new Date() } });
    for (const file of expiredFiles) {
        if (fs.existsSync(file.diskPath)) fs.unlinkSync(file.diskPath);
        await File.deleteOne({ _id: file._id });
        console.log(`🗑️ Shredded expired file: ${file.fileId}`);
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));