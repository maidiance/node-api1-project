// BUILD YOUR SERVER HERE
const express = require('express');
const userModel = require('./users/model');
const server = express();

server.use(express.json());

// GET all users
server.get('/api/users', (req, res) => {
    userModel.find()
        .then(users => {
            res.json(users);
        })
        .catch(() => {
            res.status(500).json({message: 'could not get users!'});
        })
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
