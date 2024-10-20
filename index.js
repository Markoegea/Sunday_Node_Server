const express = require('express');
const fileupload = require("express-fileupload");
const cors = require('cors');
const {Server} = require('socket.io');
const { createServer } = require('node:http');

const api = require("./routes/api.route");

const port = process.env.PORT ?? 3000

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4321"
    }
}); // Handling CORS

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileupload());
app.use(cors()); // Allows incoming request from any IP

// routes
app.use('/api', api);

// Server port listener
server.listen(port, () => {
    console.log('Server is running on port 3000, url: http://localhost:3000/');
});

// Entry point
app.get('/', (req, res) => {
    try {
        res.status(200).json({response: 'You are in the entry point'});
    } catch {
        res.status(500).json({message: error.message});
    }
});

io.on('connection', (socket) => {
    console.log('An user has connected!');

    socket.on('disconnect', () => {
        console.log('An user has disconnected');
    });

    socket.on('message', (msg) => {
        console.log('message:', msg)

        io.emit('return', 'Ha bueno');
    });
});

// Retrieve a specific element
app.get('/find/:id', (req, res) => {
    try {
        const {id} = req.params;
        //TODO: Do the logic
        res.status(200).json({answer: id})
    } catch {
        res.status(500).json({message: error.message});
    }
});

// Update a product
app.put('/update/:id', (req, res) => {
    try {
        const {id} = req.params;
        const element = req.body;
        //TODO: Do the logic here
        res.status(404).json({message: "Not Implemented"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Delete a product
app.delete('/delete/:id', (req, res) => {
    try {
        const { id } = req.params;
        res.status(200).json({message: "Element deleted: " + id})
    } catch {
        res.status(500).json({message: error.message})
    }
});