const UserModel = require('./models/users'); // Adjust the path as necessary

const handleLogin = (req, res) => {
    let rawData = "";
    req.on('data', (data) => {
        rawData += data;
    });
    req.on('end', () => {
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
};

module.exports = handleLogin;
