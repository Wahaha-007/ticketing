import request from 'supertest';
import { app } from '../../app';

// Postman and Normal Browser will send the cookie out automatically if it is the same host
// But here, superTest does not send cookie out with the following request automatically.

it('responds with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie) // Set custom header
    .send()
    .expect(400);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('reponds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
