const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process'); // Import the child_process module

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

// Middleware for handling multipart/form-data
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // for example, 10 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    },
});

app.use(express.static('public')); // Serve static files from the public directory

app.post('/upload', upload.single('file'), (req, res) => {
    const uploadedFilePath = req.file.path;
    console.log('Calling Python script with uploaded file:', uploadedFilePath);

    const pythonProcess = spawn('python3', ['./htr/scripts/demo.py', uploadedFilePath]);

    let result = '';

    pythonProcess.stdout.on('data', data => {
        // Append data to result instead of sending a response immediately
        result += data.toString();
    });

    pythonProcess.stderr.on('data', data => {
        // Log errors but don't send a response here
        console.error('Error from Python script:', data.toString());
    });

    pythonProcess.on('close', code => {
        console.log(`Python script finished with code ${code}`);
        if (code === 0) {
            // Now that the script is done, send the accumulated result as JSON
            res.json({ text: result });
        } else {
            // Only send an error response if the script fails
            res.status(500).send('Error processing the image');
        }
    });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
