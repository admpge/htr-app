const express = require('express');
const multer = require('multer');

const app = express();
const port = 3000;

// Middleware for handling multipart/form-data
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public')); // Serve static files from the public directory

app.post('/upload', upload.single('file'), (req, res) => {
    // Placeholder for processing the uploaded file
    console.log(req.file);
    res.send('File uploaded and processed');
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
