const express = require('express');
const api = express.Router();
const fileRouter = require("./files.route");

api.get('/', ((req, res) => {
    res.status(201).json({"message" : 'You are in the api Router'});
}))

api.use('/files', fileRouter);

module.exports = api;