const express = require('express');
const session = require('cookie-session');
const { PORT, SERVER_SESSION_SECRET } = require('./config.js');
const cors = require('cors');

let app = express();
// Allow all origins (or set specific origins)
app.use(cors({
    origin: 'http://localhost:5173', // Allow frontend to connect
    methods: 'GET,POST,PUT,DELETE', // Methods to allow
  }));

app.use(express.static('wwwroot'));
app.use(session({ secret: SERVER_SESSION_SECRET, maxAge: 24 * 60 * 60 * 1000 }));
app.use(require('./routes/auth.js'));
app.use(require('./routes/hubs.js'));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));



