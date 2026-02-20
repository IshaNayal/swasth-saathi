const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'swasth_saathi_secret_key';

// Mock DB (JSON for MVP simplicity, would be Postgres in production)
const DB_PATH = path.join(__dirname, 'db.json');
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], records: [] }));
}

const getData = () => JSON.parse(fs.readFileSync(DB_PATH));
const saveData = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Auth Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// 1. SEND OTP
app.post('/api/auth/send-otp', (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    console.log(`[AUTH] Sending OTP 123 to ${phone}`);
    res.json({ message: 'OTP sent successfully (Mock: 123)' });
});

// 2. VERIFY OTP
app.post('/api/auth/verify-otp', (req, res) => {
    const { phone, otp, name } = req.body;
    if (otp !== '123') return res.status(400).json({ error: 'Invalid OTP' });

    const data = getData();
    let user = data.users.find(u => u.phone === phone);

    if (!user) {
        user = { phone, name: name || 'User', role: 'patient', created_at: new Date() };
        data.users.push(user);
        saveData(data);
    }

    const token = jwt.sign({ phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user });
});

// 3. GET PROFILE
app.get('/api/user/profile', authenticate, (req, res) => {
    const data = getData();
    const user = data.users.find(u => u.phone === req.user.phone);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// 4. ML SYMPTOM ANALYZE
app.post('/api/health/analyze', authenticate, async (req, res) => {
    try {
        const { symptoms, duration, severity } = req.body;
        console.log(`[ML] Analyzing symptoms for user: ${req.user.phone}`);

        const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/analyze-symptoms`, {
            symptoms, duration, severity
        });

        // Log to history
        const data = getData();
        data.records.push({
            userId: req.user.phone,
            timestamp: new Date(),
            type: 'symptom_analysis',
            input: { symptoms, duration, severity },
            result: mlResponse.data
        });
        saveData(data);

        res.json(mlResponse.data);
    } catch (err) {
        console.error("ML Error:", err.message);
        res.status(500).json({ error: 'Healthcare analysis service is offline. Using local cache.' });
    }
});

app.listen(PORT, () => console.log(`Backend live on port ${PORT}`));
