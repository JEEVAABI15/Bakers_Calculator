import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../server.js';

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ name: 'User', email: 'user@example.com', password: 'pass1234' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'user@example.com');
  });

  it('should not register with existing email', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ name: 'User', email: 'user2@example.com', password: 'pass1234' });
    const res = await request(app)
      .post('/api/users/register')
      .send({ name: 'User', email: 'user2@example.com', password: 'pass1234' });
    expect(res.statusCode).toBe(409);
  });

  it('should login with correct credentials', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ name: 'User', email: 'login@example.com', password: 'pass1234' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'login@example.com', password: 'pass1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should not login with wrong password', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ name: 'User', email: 'fail@example.com', password: 'pass1234' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'fail@example.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });

  it('should get profile with valid token', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ name: 'User', email: 'profile@example.com', password: 'pass1234' });
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'profile@example.com', password: 'pass1234' });
    const userToken = loginRes.body.token;
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'profile@example.com');
  });

  it('should not get profile without token', async () => {
    const res = await request(app)
      .get('/api/users/me');
    expect(res.statusCode).toBe(401);
  });

  it('should update profile', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ name: 'User', email: 'update@example.com', password: 'pass1234' });
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'update@example.com', password: 'pass1234' });
    const userToken = loginRes.body.token;
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Updated User' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated User');
  });
}); 