import { Button, Input } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadComponent = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async event => {
        event.preventDefault();

        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Upload successful', data.text);
                // Call the function passed as prop to update the parent component's state
                // onUploadSuccess(data.text);
                navigate('/editor', { state: { text: data.text } });
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading the file');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="file"
                onChange={handleFileChange}
                required
                inputProps={{ accept: 'image/jpeg, image/png' }}
            />
            <Button type="submit" variant="contained" color="primary">
                Upload
            </Button>
        </form>
    );
};

export default UploadComponent;
