import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import EditorPage from './components/EditorPage';
import Header from './components/Header';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/editor" element={<EditorPage />} />
            </Routes>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
