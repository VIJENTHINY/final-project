
import React from 'react';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Profile from './components/Profile'
import Subjects from './components/Subjects'; 
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignUpPage';
import NotesPage from './components/NotesPage';
import CalendarCom from './components/CalendarCom';
import Homeworks from './components/Homeworks/Homeworks';


const App = () => {


    return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/calendar" element ={< CalendarCom />} />
                    <Route path="/subjects/:subjectId/homeworks" element = {<Homeworks/>} />
                    <Route path="/subjects" element={<Subjects />} />
                    <Route path="/subjects/:subjectId" element={<NotesPage />} />
                </Routes>
            </BrowserRouter>

    );
};

    

export default App;
