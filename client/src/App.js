import React, { useState } from 'react';
import Header from './components/Header';
import UploadComponent from './components/UploadComponent';
import EditorComponent from './components/EditorComponent';

function App() {
    // State to store the digitized text
    const [digitizedText, setDigitizedText] = useState('');

    // Function to handle the completion of the HTR process
    const handleHTRSuccess = text => {
        setDigitizedText(text);
    };

    return (
        <div>
            <Header />
            <UploadComponent onUploadSuccess={handleHTRSuccess} />
            <EditorComponent text={digitizedText} />
        </div>
    );
}

export default App;
