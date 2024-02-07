const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

app.use(cors());

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    },
});

app.post('/upload', upload.single('file'), (req, res) => {
    const uploadedFilePath = req.file.path;
    console.log('Calling Python script with uploaded file:', uploadedFilePath);

    const pythonProcess = spawn('python3', ['./htr/scripts/demo.py', uploadedFilePath]);

    let result = '';

    pythonProcess.stdout.on('data', data => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', data => {
        console.error('Error from Python script:', data.toString());
    });

    pythonProcess.on('close', code => {
        console.log(`Python script finished with code ${code}`);
        if (code === 0) {
            res.json({ text: result });
        } else {
            res.status(500).send('Error processing the image');
        }
    });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
