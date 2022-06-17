import request from 'supertest';
import { app } from '../../app';

//jest.setTimeout(40000);

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup') // POST moethod and URI
    .send({
      email: 'test@test.com', // Embedded in body
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup') // POST moethod and URI
    .send({
      email: 'test@@test.com', // Embedded in body
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup') // POST moethod and URI
    .send({
      email: 'test@test.com', // Embedded in body
      password: 'pd',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  return request(app)
    .post('/api/users/signup') // POST moethod and URI
    .send({
      //email: 'test@test.com', // Embedded in body
      //password: 'pd',
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app) // Use await or return, same final effect
    .post('/api/users/signup') // POST moethod and URI
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
