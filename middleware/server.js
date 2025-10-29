// server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { authenticateJWT, SECRET_KEY } = require('./middleware/authenticateJWT');

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());

// Hardcoded user and account data
const USER = { username: 'john', password: '12345' };
let accountBalance = 1000;

// --------------------------
// Route 1: Login (Public)
// --------------------------
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === USER.username && password === USER.password) {
        // Generate JWT token
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ message: 'Login successful', token });
    }

    res.status(401).json({ message: 'Invalid credentials' });
});

// --------------------------
// Route 2: Get Balance (Protected)
// --------------------------
app.get('/balance', authenticateJWT, (req, res) => {
    res.json({ username: req.user.username, balance: accountBalance });
});

// --------------------------
// Route 3: Deposit Money (Protected)
// --------------------------
app.post('/deposit', authenticateJWT, (req, res) => {
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ message: 'Invalid deposit amount' });

    accountBalance += amount;
    res.json({ message: `Deposited $${amount}`, balance: accountBalance });
});

// --------------------------
// Route 4: Withdraw Money (Protected)
// --------------------------
app.post('/withdraw', authenticateJWT, (req, res) => {
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ message: 'Invalid withdrawal amount' });
    if (amount > accountBalance) return res.status(400).json({ message: 'Insufficient balance' });

    accountBalance -= amount;
    res.json({ message: `Withdrew $${amount}`, balance: accountBalance });
});

// --------------------------
// Start Server
// --------------------------
app.listen(PORT, () => {
    console.log(`✅ Banking API running on http://localhost:${PORT}`);
});
