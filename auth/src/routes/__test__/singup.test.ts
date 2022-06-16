import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup') // POST moethod and URI
    .send({
      email: 'test@test.com', // Embedded in body
      password: 'password',
    })
    .expect(201);
});
