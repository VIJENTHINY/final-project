const { MongoClient } = require("mongodb");
const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const verifyToken = require('./VerifyToken')
const { MONGO_URI, JWT_SECRET } = process.env;
const authenticatedRouter = express.Router();
const { v4: uuidv4 } = require("uuid");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: 'majority'
    }
};

const client = new MongoClient(MONGO_URI, options);
client.connect();

// Add this route to handle token refresh

authenticatedRouter.post('/signup', async (req, res) => {
    try {
        console.log("he;looo: " + JSON.stringify(req.body));
        const { firstname, lastname, username, email, password, confirmPassword } = req.body;
        if (!firstname || !lastname || !username || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const db = client.db('meOrganize');
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        const newUser = {
            _id: uuidv4(),
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            biography:'',  
        };

        await usersCollection.insertOne(newUser);

        const tokenPayload = {
            userId: newUser._id,
            email: newUser.email,
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });
        newUser.token = token;
        console.log(newUser);
        res.status(201).json({ token, message: 'User registered successfully' });
        
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});

// login : authorization
authenticatedRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const db = client.db('meOrganize');
        const usersCollection = db.collection('users');

        const user = await usersCollection.find({ email }).toArray();
        console.log(password, user[0].password);
        if (!user || !(await bcrypt.compare(password, user[0].password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // user = [{_id, name, email}]
        const tokenPayload = {
            userId: user[0]._id,
            email: user[0].email,
        };

        
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });
        console.log();
        user[0].token = token;
        res.json(user[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

authenticatedRouter.get('/profile',verifyToken, async (req, res) => {
    try {
        const db = client.db('meOrganize');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});


authenticatedRouter.put('/profile', verifyToken, async (req, res) => {
    try {
        const { biography} = req.body;

        const db = client.db('meOrganize');
        const usersCollection = db.collection('users');

        const updatedUser = await usersCollection.findOneAndUpdate(
            { _id: req.userId },
            {
                $set: {
                    biography
                },
            },
            { returnOriginal: false }
        );

        if (!updatedUser.value) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser.value });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = authenticatedRouter;