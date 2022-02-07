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
            res.status(500).json({message: 'The users information could not be retrieved'});
        })
});

// GET specific user by id
server.get('/api/users/:id', (req, res) => {
    let { id } = req.params;
    userModel.findById(id)
        .then(user => {
            if(user === null) {
                res.status(404).json({message: `The user with the specified ID does not exist`});
            } else {
                res.json(user);
            }
        })
        .catch(() => {
            res.status(500).json({message: `The user information could not be retrieved`});
        })
});

// POST a new user
server.post('/api/users', (req, res) => {
    let user = req.body;
    if(!user.name || !user.bio ){
        res.status(400).json({message: 'Please provide name and bio for the user'});
    } else {
        userModel.insert(user)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(() => {
                res.status(500).json({message: 'There was an error while saving the user to the database'});
            })
    }
});

// PUT update specified user with id using data from request body
// Return updated user
server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        if(user === null) {
            res.status(404).json({message: `The user with the specified ID does not exist`});
            return;
        }
        let body = req.body;
        if(!body.name || !body.bio) {
            res.status(500).json({message: `Please provide name and bio for the user`});
            return;
        } else {
            const newUser = await userModel.update(id, body);
            res.status(200).json(newUser);
        }
    } catch (e) {
        res.status(500).json({message: `The user information could not be modified`});
    }
});

// DELETE specific user with id and return deleted user
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    userModel.remove(id)
        .then(user => {
            if(user === null) {
                res.status(404).json({message: `The user with the specified ID does not exist`});
                return;
            }
            res.status(200).json(user);
        })
        .catch(() => {
            res.status(500).json({message: `The user could not be removed`});
        })
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
