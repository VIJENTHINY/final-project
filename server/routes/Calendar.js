const { MongoClient } = require("mongodb");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { MONGO_URI } = process.env;
const calendarRouter = require('express').Router();
const { v4: uuidv4 } = require("uuid");
const verifyToken = require('./VerifyToken')

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: 'majority' 
    }
};

const client = new MongoClient(MONGO_URI, options);
client.connect();




calendarRouter.get('/',verifyToken, async (req, res) => {
    try {
        const db = client.db('meOrganize');
        const eventsCollection = db.collection('calendar');

        const allEvents = await eventsCollection.find({ userId: req.userId }).toArray();

        res.json(allEvents);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

calendarRouter.get('/events/:id',verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const db = client.db('meOrganize');
        const eventsCollection = db.collection('calendar');

        const event = await eventsCollection.findOne({ _id: id, userId: req.userId });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

calendarRouter.post('/create-event',verifyToken, async (req, res) => {
    const { date, event } = req.body;

    try {
        const db = client.db('meOrganize');
        const eventsCollection = db.collection('calendar');

        const newEvent = {
            _id: uuidv4(),
            userId: req.userId,
            date,
            event,
        };

        await eventsCollection.insertOne(newEvent);
        res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

calendarRouter.delete('/delete-event/:eventId', verifyToken, async (req, res) => {
    const { eventId } = req.params;

    try {
        const db = client.db('meOrganize');
        const eventsCollection = db.collection('calendar');

        const result = await eventsCollection.deleteOne({ _id: eventId, userId: req.userId });

        if (result.deletedCount === 1) {
            res.json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});
module.exports = calendarRouter;