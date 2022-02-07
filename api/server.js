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

// GET specific user by id
server.get('/api/users/:id', (req, res) => {
    let { id } = req.params;
    userModel.findById(id)
        .then(user => {
            if(user === null) {
                res.status(404).json({message: `user ${id} not found!`});
            } else {
                res.json(user);
            }
        })
        .catch(() => {
            res.status(500).json({message: `could not get user!`});
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

// PUT update specified user with id using data from request body
// Return updated user
server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        if(user === null) {
            res.status(404).json({message: `user ${id} not found!`});
            return;
        }
        let body = req.body;
        if(!body.name) {
            res.status(500).json({message: `name is required`});
            return;
        } else if (!body.bio) {
            res.status(500).json({message: 'bio is required'});
            return;
        } else {
            const newUser = await userModel.update(id, body);
            res.status(200).json(newUser);
        }
    } catch (e) {
        res.status(500).json({message: `could not update user!`});
    }
});

// DELETE specific user with id and return deleted user
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    userModel.remove(id)
        .then(user => {
            if(user === null) {
                res.status(404).json({message: `user ${id} not found!`});
                return;
            }
            res.status(200).json(user);
        })
        .catch(() => {
            res.status(500).json({message: `could not delete user!`});
        })
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
