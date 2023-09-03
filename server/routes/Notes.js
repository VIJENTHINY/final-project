const { MongoClient } = require("mongodb");
const path = require('path');
const { v4: uuidv4 } = require("uuid");
const express = require('express');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const verifyToken = require('./VerifyToken')
const { MONGO_URI } = process.env;
const notesRouter = express.Router();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: 'majority'
    }
};

const client = new MongoClient(MONGO_URI, options);
client.connect();

// Create a new note
notesRouter.post('/',verifyToken, async (req, res) => {
    try {
        const { subjectId, title, content, color } = req.body;

        if (!subjectId || !title || !content || !color ) {
            return res.status(400).json({ error: 'Subject ID, title, and content are required' });
        }

        // Assuming you have the userId available in req.userId from your authentication process
        const userId = req.userId;

        const newNote = {
            _id: uuidv4(),
            subjectId,
            title,
            content,
            userId, 
            color
        };

        const db = client.db('meOrganize');
        const result = await db.collection('Notes').insertOne(newNote);

        const result1=await db.collection('Notes').findOne({ _id: newNote._id });

        console.log("result: " + JSON.stringify(result1));
        res.status(201).json(result1);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

notesRouter.patch('/:noteId', verifyToken, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const { title, content } = req.body;

        const db = client.db('meOrganize');
        
        const result = await db.collection('Notes').updateOne(
            { _id: noteId }, // Filter by note ID
            { $set: { title, content } } // Update title and content
        );

        if (result.modifiedCount === 1) {
            res.status(200).json({ message: 'Note updated successfully' });
        } else {
            throw new Error('Note not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all notes
notesRouter.get('/', verifyToken, async (req, res) => {
    try {
        const db = client.db('meOrganize');
        const userId = req.userId; // Extracted from JWT
        const subjectId = req.query.subjectId;

        let filter = { userId }; // Only get notes belonging to the user

        if (subjectId) {
            filter.subjectId = subjectId;
        }

        const subjectNotes = await db.collection('Notes').find(filter).toArray();

        res.status(200).json(subjectNotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a note
notesRouter.delete('/:noteId', verifyToken,async (req, res) => {
    try {
        const noteId = req.params.noteId;

        const db = client.db('meOrganize');
        const result = await db.collection('Notes').deleteOne({ _id: noteId });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Note deleted successfully' });
        } else {
            throw new Error('Note not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = notesRouter;