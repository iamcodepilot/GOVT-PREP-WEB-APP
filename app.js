const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/govtprep").then(function() {
    console.log("Database Connected");
});

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    email: String,
    exam: String,
    password: String
});

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

// Models
const UserModel = mongoose.model('users', userSchema);
const ContactModel = mongoose.model('contacts', contactSchema);

// Create server
const server = http.createServer(function(req, res) {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('register.html').pipe(res);
    } else if (req.url === "/register" && req.method === "POST") {
        let rawData = "";
        req.on('data', function(data) {
            rawData += data;
        });
        req.on('end', function() {
            let inputData = new URLSearchParams(rawData);
            UserModel.create({
                name: inputData.get('name'),
                mobile: inputData.get('mobile'),
                email: inputData.get('email'),
                exam: inputData.get('exam'),
                password: inputData.get('password')
            })
            .then(() => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("User Registered Successfully");
                res.end();
            })
            .catch(err => {
                console.error("Error saving user:", err);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.write("Error registering user");
                res.end();
            });
        });
    } else if (req.url === '/login' && req.method === "POST") {
        let rawData = "";
        req.on('data', function(data) {
            rawData += data;
        });
        req.on('end', function() {
            const inputData = new URLSearchParams(rawData);
            const email = inputData.get('email');
            const password = inputData.get('password');

            // Check if user exists in the database
            UserModel.findOne({ email: email, password: password })
                .then(user => {
                    if (user) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.write("Login Successful");
                    } else {
                        res.writeHead(401, { 'Content-Type': 'text/html' });
                        res.write("Invalid credentials");
                    }
                    res.end();
                })
                .catch(err => {
                    console.error("Error during login:", err);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.write("Error during login");
                    res.end();
                });
        });
    } else if (req.url === '/login') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('login.html').pipe(res); // Serve the login page
    } else if (req.url === '/contact' && req.method === "POST") {
        let rawData = "";
        req.on('data', function(data) {
            rawData += data;
        });
        req.on('end', function() {
            let inputData = new URLSearchParams(rawData);
            // Save contact form details
            ContactModel.create({
                name: inputData.get('name'),
                email: inputData.get('email'),
                message: inputData.get('message')
            })
            .then(() => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("Message sent successfully");
                res.end();
            })
            .catch(err => {
                console.error("Error saving contact message:", err);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.write("Error sending message");
                res.end();
            });
        });
    } else if (req.url === '/contact') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('contact.html').pipe(res); // Serve the contact page
    }
});

// Start the server
server.listen(8000, function() {
    console.log("Server started at 8000");
});
