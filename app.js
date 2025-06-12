const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and GIF images are allowed'), false);
    }
};

// Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({
        message: 'Image uploaded successfully',
        fileName: req.file.filename,
        url: fileUrl
    });
});

// Get image (served via static middleware, but provide explicit route for clarity)
app.get('/api/images/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});