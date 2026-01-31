const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../routes/authRoutes');
const { errorHandler } = require('../middlewares/errorHandler');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

// Mock DB Connection
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth API', () => {
    let token;

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser' + Date.now(),
                email: 'test' + Date.now() + '@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should login the user', async () => {
        // Create a user first (or use the one from previous test if we track credentials)
        // For simplicity, let's just register another one to be sure
        const email = 'login' + Date.now() + '@example.com';
        const password = 'password123';

        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'loginuser' + Date.now(),
                email,
                password
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email,
                password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
