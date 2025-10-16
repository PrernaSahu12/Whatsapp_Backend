const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
	origin: 'http://localhost:5173',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Try to load route modules if they exist; otherwise mount simple placeholders
try {
	app.use('/api/auth', require('./routes/authRoutes'));
} catch (e) {
	app.use('/api/auth', (req, res) => res.status(200).json({ ok: true }));
}

try {
	app.use('/api/users', require('./routes/userRoutes'));
} catch (e) {
	app.use('/api/users', (req, res) => res.status(200).json({ ok: true }));
}

app.get('/', (req, res) => res.send('WhatsApp clone backend running'));

module.exports = app;

