const express = require('express');
const fileRouter = express.Router();
const {readFile, readAllFile, uploadFile, updateFile, deleteFile} = require('../controllers/files.controller');

fileRouter.get('/read/:location', readFile);
fileRouter.get('/readAll', readAllFile);
fileRouter.post('/create', uploadFile);
fileRouter.post('/delete', deleteFile);
fileRouter.post('/update', updateFile);

module.exports = fileRouter;