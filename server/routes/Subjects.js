const { MongoClient } = require("mongodb");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const verifyToken = require('./VerifyToken')
const { MONGO_URI } = process.env;
const subjectsRouter = require('express').Router();
const { v4: uuidv4 } = require("uuid");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: 'majority' // Corrected write concern mode
    }
};

const client = new MongoClient(MONGO_URI, options);
client.connect();

// POST /subjects: Create a new subject
subjectsRouter.post('/',verifyToken, async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const db = client.db('meOrganize');
        const newSubject = {
            _id: uuidv4(),
            title,
            userId: req.userId, // Add the user's ID to the subject
        };

        console.log('Token Payload:', req.userId);
        await db.collection("Subjects").insertOne(newSubject);
        res.status(201).json({ status: 201, data: newSubject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /subjects: Get all subjects belonging to the authenticated user
subjectsRouter.get('/',verifyToken,  async (req, res) => {
    try {
        const db = client.db('meOrganize');
        const subjects = await db.collection('Subjects').find({ userId: req.userId }).toArray();

        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /subjects/:subjectId: Update a subject's title
subjectsRouter.patch('/:subjectId', async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const db = client.db('meOrganize');

        // Update the subject only if it belongs to the current user
        const updatedSubject = await db.collection('Subjects').findOneAndUpdate(
            { _id: subjectId, userId: req.userId },
            { $set: { title } },
            { returnOriginal: false }
        );

        if (!updatedSubject.value) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        res.status(200).json({ data: updatedSubject.value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /subjects/:subjectId: Delete a subject
subjectsRouter.delete('/:subjectId',verifyToken,  async (req, res) => {
    try {
        const { subjectId } = req.params;

        const db = client.db('meOrganize');

        // Delete the subject only if it belongs to the current user
        const subjectDeleteResult = await db.collection('Subjects').deleteOne({ _id: subjectId, userId: req.userId });

        if (subjectDeleteResult.deletedCount === 1) {
            res.status(200).json({ message: 'Subject deleted successfully' });
        } else {
            res.status(404).json({ error: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = subjectsRouter;
