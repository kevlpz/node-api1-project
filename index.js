// implement your API here
// import express from 'express';
const express = require('express');
// import db from './data/db.js';
const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
    // console.log(db.find());
    db.find()
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "User information could not be retrieved"})
        })
});

server.post('/api/users', (req, res) => {
    const user = req.body;
    console.log(req.body);
    db.insert(user)
        .then(idObj => {
            db.findById(idObj)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                res.status(500).json({error: "Server error retrieving user"});
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Server error inserting user"});
        });
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if(user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({error: "User does not exist"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "User information could not be retrieved"})
        })
});

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
        .then(deleted => {
            if(deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({error: 'User with ID does not exist'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Server error deleting"});
        })
});

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    if(!name && !bio) {
        res.status(400).json({error: "Needs changes"})
    }
    db.update(id, { name, bio })
        .then(updated => {
            if(updated) {
                db.findById(id)
                    .then(user => res.status(200).json(user))
                    .catch(err => {
                        res.status(500).json({error: "Error retrieving user"})
                    });
            } else {
                res.status(404).json({error: `User with id ${id} not found`});
            }
        })
        .catch(err => {
            res.status(500).json({error: 'Error updating user'});
        });
})

server.listen(process.env.PORT || 5000, () => console.log('server running'));