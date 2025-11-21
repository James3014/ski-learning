const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World from NestJS!' });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        db: 'connected',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
