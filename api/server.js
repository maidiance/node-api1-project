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

// POST a new user
server.post('/api/users', (req, res) => {
    let user = req.body;
    if(!user.name){
        res.status(500).json({message: 'name is required'});
    } else if(!user.bio){
        res.status(500).json({message: 'bio is required'});
    } else {
        userModel.insert(user)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(() => {
                res.status(500).json({message: 'could not create user!'});
            })
    }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
