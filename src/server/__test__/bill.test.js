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
  // Register and login a user to get a token
  await request(app)
    .post('/api/users/register')
    .send({ name: 'BillUser', email: 'bill@example.com', password: 'pass1234' });
  const loginRes = await request(app)
    .post('/api/users/login')
    .send({ email: 'bill@example.com', password: 'pass1234' });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Bill Endpoints', () => {
  let billId;
  it('should create a bill', async () => {
    const res = await request(app)
      .post('/api/bills')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [], total: 100 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    billId = res.body._id;
  });

  it('should get all bills', async () => {
    const res = await request(app)
      .get('/api/bills')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a bill', async () => {
    const res = await request(app)
      .put(`/api/bills/${billId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ total: 200 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('total', 200);
  });

  it('should delete a bill', async () => {
    const res = await request(app)
      .delete(`/api/bills/${billId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Deleted');
  });
}); 