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
    .send({ name: 'ProductUser', email: 'product@example.com', password: 'pass1234' });
  const loginRes = await request(app)
    .post('/api/users/login')
    .send({ email: 'product@example.com', password: 'pass1234' });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Product Endpoints', () => {
  let productId;
  it('should create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Cake', price: 10, quantity: 5 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    productId = res.body._id;
  });

  it('should get all products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a product', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Cake' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Cake');
  });

  it('should delete a product', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Deleted');
  });
}); 