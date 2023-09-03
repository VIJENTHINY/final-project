const express = require('express');
const app = express();
const PORT = 8000;
const path = require('path'); // Import the 'path' module

// Middleware to handle CORS headers
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const subjectsRoutes = require('./routes/Subjects');
const notesRoutes = require('./routes/Notes');
const authenticatedRoutes = require('./routes/Auth');
const calendarRoutes = require('./routes/Calendar');
const homeworkRoutes = require('./routes/HomeWork');



app.use('/api/subjects', subjectsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/user', authenticatedRoutes);
app.use('/api/events', calendarRoutes);
app.use('/api/homeworks', homeworkRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

