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
    .send({ name: 'InventoryUser', email: 'inventory@example.com', password: 'pass1234' });
  const loginRes = await request(app)
    .post('/api/users/login')
    .send({ email: 'inventory@example.com', password: 'pass1234' });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Inventory Endpoints', () => {
  let itemId;
  it('should create an inventory item', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Flour', totalQuantity: 10, unit: 'kg', costPerUnit: 2, totalCost: 20 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    itemId = res.body._id;
  });

  it('should get all inventory items', async () => {
    const res = await request(app)
      .get('/api/inventory')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update an inventory item', async () => {
    const res = await request(app)
      .put(`/api/inventory/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Flour' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Flour');
  });

  it('should delete an inventory item', async () => {
    const res = await request(app)
      .delete(`/api/inventory/${itemId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Deleted');
  });
}); 