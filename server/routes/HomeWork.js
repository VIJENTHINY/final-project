const { MongoClient } = require("mongodb");
const path = require('path');
const { v4: uuidv4 } = require("uuid");
const express = require('express');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const verifyToken = require('./VerifyToken')
const { MONGO_URI } = process.env;
const homeworksRouter = express.Router();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: 'majority'
    }
};

const client = new MongoClient(MONGO_URI, options);
client.connect();

homeworksRouter.post('/', verifyToken, async (req, res) => {
    try {
        const { subjectId, title, description, dueDate, status } = req.body;

        if (!subjectId || !title || !description || !dueDate || !status ) {
            return res.status(400).json({ error: 'Subject ID, title, description, and dueDate are required' });
        }
        const userId = req.userId;

        const newHomework = {
            _id: uuidv4(), 
            subjectId,
            title,
            description,
            dueDate,
            status,
            userId,
        };

        const db = client.db('meOrganize');
        const result = await db.collection('Homeworks').insertOne(newHomework);

        const result1=await db.collection('Homeworks').findOne({ _id: newHomework._id });

        console.log("result: " + JSON.stringify(result1));
        res.status(201).json(result1);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


homeworksRouter.get('/', verifyToken, async (req, res) => {
    try {
        const db = client.db('meOrganize');
        const userId = req.userId; 
        const subjectId = req.query.subjectId;

        let filter = { userId }; 

        if (subjectId) {
            filter.subjectId = subjectId;
        }

        const subjectHomeWorks = await db.collection('Homeworks').find(filter).toArray();

        res.status(200).json(subjectHomeWorks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


homeworksRouter.patch('/:homeworkId', verifyToken, async (req, res) => {
    try {
        const homeworkId = req.params.homeworkId;
        const { title, description, dueDate, status} = req.body;

        const db = client.db('meOrganize');
        
        const result = await db.collection('Homeworks').updateOne(
            { _id: homeworkId }, 
            { $set: { title, description, dueDate, status } } 
        );

        const result1=await db.collection('Homeworks').findOne({ _id: homeworkId });
        console.log(result1);


        if (result.modifiedCount === 1) {
            res.status(200).json({ message: 'Homoworks updated successfully', data: result });
        } else {
            throw new Error('Homework not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

homeworksRouter.delete('/:homeworkId', verifyToken, async (req, res) => {
    try {
        const homeworkId = req.params.homeworkId;

        const db = client.db('meOrganize');
        const result = await db.collection('Homeworks').deleteOne({ _id: homeworkId });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Homework deleted successfully' });
        } else {
            throw new Error('Homework not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = homeworksRouter;