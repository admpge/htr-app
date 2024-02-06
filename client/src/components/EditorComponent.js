import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const EditorComponent = ({ text }) => {
    const quillRef = useRef(null);

    useEffect(() => {
        if (!quillRef.current) return; // Exit if ref is not attached

        const editor = new Quill(quillRef.current, {
            theme: 'snow',
        });

        return () => {
            // Cleanup editor on component unmount
            quillRef.current.innerHTML = '';
        };
    }, []); // Empty dependency array ensures this runs once on mount

    useEffect(() => {
        if (!quillRef.current) return; // Exit if ref is not attached

        const editor = new Quill(quillRef.current);
        editor.clipboard.dangerouslyPasteHTML(text);

        // Cleanup to avoid duplicate editors
        return () => {
            quillRef.current.innerHTML = '';
        };
    }, [text]); // Dependency on text ensures it runs when text changes

    return <div ref={quillRef} />;
};

export default EditorComponent;
