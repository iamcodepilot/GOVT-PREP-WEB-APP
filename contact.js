// contact.js
const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/govtprep").then(function() {
    console.log("Database Connected for Contact");
});

// Define contact schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

const ContactModel = mongoose.model('contacts', contactSchema);

// Create server for contact functionality
const server = http.createServer(function(req, res) {
    if (req.url == '/contact' && req.method == "POST") {
        let rawData = "";
        req.on('data', function(data) {
            rawData += data;
        });
        req.on('end', function() {
            const inputData = new URLSearchParams(rawData);
            const name = inputData.get('name');
            const email = inputData.get('email');
            const message = inputData.get('message');

            // Save contact message in the database
            ContactModel.create({
                name: name,
                email: email,
                message: message
            })
            .then(() => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("Message sent successfully");
                res.end();
            })
            .catch(err => {
                console.error("Error saving message:", err);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.write("Error sending message");
                res.end();
            });
        });
    } else if (req.url == '/contact') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('contact.html').pipe(res); // Serve the contact page
    }
});

// Start server for contact
server.listen(9000, function() {
    console.log("Contact server started at 9000");
});
