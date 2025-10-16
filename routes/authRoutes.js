const express = require('express');
const router = express.Router();

// Minimal placeholder endpoints
router.post('/login', (req, res) => {
	res.json({ ok: true, message: 'login placeholder' });
});

router.post('/register', (req, res) => {
	res.json({ ok: true, message: 'register placeholder' });
});

module.exports = router;
