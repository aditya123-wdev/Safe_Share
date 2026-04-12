const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, downloadFile } = require('../controllers/fileController');

// Multer config: temporarily store in 'temp/' folder
const upload = multer({ dest: 'temp/' }); 

router.post('/upload', upload.single('file'), uploadFile);
router.get('/download/:id', downloadFile);

module.exports = router;