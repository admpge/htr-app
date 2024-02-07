import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        event.target.nextElementSibling.innerText = event.target.files[0].name;
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
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Handwritten Note Digitizer</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <label className="mb-2 text-gray-700" htmlFor="file-upload">
                        <div className="cursor-pointer bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-300 ease-in-out">
                            Choose file
                        </div>
                    </label>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} required accept="image/jpeg, image/png" />
                    <span id="file-name" className="text-gray-500 mt-1"></span>
                    <button type="submit" className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-300 ease-in-out">
                        UPLOAD
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadComponent;
