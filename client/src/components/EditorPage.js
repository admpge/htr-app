import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useLocation } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

const EditorPage = () => {
    const location = useLocation();
    const [text, setText] = useState('');

    useEffect(() => {
        // Check if text was passed in the location state
        if (location.state?.text) {
            setText(location.state.text);
        }
    }, [location]); // React to changes in location.state

    // Function to handle text change in the editor
    const handleTextChange = content => {
        setText(content);
    };

    // Function to handle download of the text
    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'digitized_text.txt';
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div>
            <ReactQuill theme="snow" value={text} onChange={handleTextChange} />
            <button
                onClick={handleDownload}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Save
            </button>
        </div>
    );
};

export default EditorPage;
