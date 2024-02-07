import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
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
        <div className="flex flex-col items-center justify-start h-screen bg-gray-800 p-4 pt-20">
            <div className="bg-gray-700 text-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Handwritten Note Digitizer</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <label className="mb-2" htmlFor="file-upload">
                        <div className="cursor-pointer bg-blue-700 text-white rounded p-2 hover:bg-blue-800 transition duration-300 ease-in-out">
                            Choose file
                        </div>
                    </label>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} required accept="image/jpeg, image/png" />
                    <span id="file-name" className="text-gray-300 mt-1">{file ? file.name : 'No file chosen'}</span>
                    <button type="submit" className="mt-4 bg-gradient-to-r from-blue-700 to-green-700 text-white rounded p-2 hover:bg-gradient-to-r hover:from-blue-800 hover:to-green-800 transition duration-300 ease-in-out">
                        UPLOAD
                    </button>
                </form>
                {previewSrc && (
                    <div className="mt-4">
                        <img src={previewSrc} alt="Preview" className="max-w-xs rounded-lg shadow-lg" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadComponent;
