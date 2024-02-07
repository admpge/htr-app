import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useLocation } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import '../EditorStyles.css'; 


const EditorPage = () => {
    const location = useLocation();
    const [text, setText] = useState('');

    useEffect(() => {
        if (location.state?.text) {
            setText(location.state.text);
        }
    }, [location]);

    const handleTextChange = content => {
        setText(content);
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'digitized_text.txt';
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="min-h-screen bg-gray-800 text-white">
            <div className="container mx-auto py-12">
                <div className="bg-gray-700 p-9 rounded-lg shadow-lg">
                    <ReactQuill
                        theme="snow"
                        value={text}
                        onChange={handleTextChange}
                        className="mb-20"
                        style={{ height: '300px' }}
                    />
                    <div className="flex justify-center">
                        <button
                            onClick={handleDownload}
                            className="text-white font-bold py-2 px-4 rounded transition ease-in-out duration-150 w-48 bg-gradient-to-r from-blue-700 to-green-700 hover:from-blue-800 hover:to-green-800"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
