const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');

const app = express();

app.use(cors());

let redisClient = redis.createClient();

module.exports = redisClient;

(async () => {
    redisClient.on('error', (error) => {
        console.log(error);
    });

    redisClient.on('connect', () => {
        console.log('Redis connected!');
    });

    await redisClient.connect();
})();

const authRouter = require('./routers/authRouter');
const usersRouter = require('./routers/usersRouter');

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api', usersRouter);

const start = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://sergeymelekh95:8000160q@cluster0.rb7ridz.mongodb.net/users-database?retryWrites=true&w=majority'
        );

        app.listen(PORT, () =>
            console.log(`server started on the port ${PORT}`)
        );
    } catch (err) {
        console.log(err);
    }
};

start();
