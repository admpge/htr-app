import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const EditorComponent = ({ text }) => {
    const quillRef = useRef(null);
    const quillInstance = useRef(null); // To store the Quill instance

    // Initialize Quill once on component mount
    useEffect(() => {
        if (quillRef.current) {
            quillInstance.current = new Quill(quillRef.current, {
                theme: 'snow',
            });
        }
    }, []);

    // Update Quill content when 'text' prop changes
    useEffect(() => {
        if (quillInstance.current) {
            // This line will update the editor's content without reinitializing Quill
            quillInstance.current.clipboard.dangerouslyPasteHTML(text);
        }
    }, [text]);

    return <div ref={quillRef} />;
};

export default EditorComponent;
