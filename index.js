const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process'); // Import the child_process module

const app = express();
const port = 3000;

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
        const recognizedText = data.toString();
        console.log('Recognized Text:', recognizedText);

        // Send HTML response with script to set Quill content
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Text Output</title>
                <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
            </head>
            <body>
                <div id="editor"></div>
                <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
                <script>
                    var quill = new Quill('#editor', {
                        theme: 'snow'
                    });
                    quill.setText(\`${recognizedText}\`);
                </script>
            </body>
            </html>
        `);
    });

    pythonProcess.stderr.on('data', data => {
        console.error('Error from Python script:', data.toString());
    });

    pythonProcess.on('close', code => {
        console.log(`Python script finished with code ${code}`);
        if (code === 0) {
            res.send(result);
        } else {
            res.status(500).send('Error processing the image');
        }
    });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
