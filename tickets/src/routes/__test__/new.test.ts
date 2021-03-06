import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper'; // But will really import the mock version

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404); // Worth remember !
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401); // NotAuthorizedError
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '', // Invalid title for sure
      price: 10,
    })
    .expect(400); // RequestValidationError

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10, // No title at all
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Valid_Title',
      price: -10, // Invalid price for sure
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Valid_Title', // No price at all
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({}); // List all record
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Valid_Title',
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
});

// --------- Added to test publishing ----------- //
it('publish an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Valid_Title',
      price: 20,
    })
    .expect(201);

  // console.log(natsWrapper);

  // console.log result
  //     {
  //       client: {
  //         publish: [Function: mockConstructor] {
  //           _isMockFunction: true,
  //           getMockImplementation: [Function (anonymous)],
  //           mock: [Getter/Setter],
  //           mockClear: [Function (anonymous)],
  //           mockReset: [Function (anonymous)],
  //           mockRestore: [Function (anonymous)],
  //           mockReturnValueOnce: [Function (anonymous)],
  //           mockResolvedValueOnce: [Function (anonymous)],
  //           mockRejectedValueOnce: [Function (anonymous)],
  //           mockReturnValue: [Function (anonymous)],
  //           mockResolvedValue: [Function (anonymous)],
  //           mockRejectedValue: [Function (anonymous)],
  //           mockImplementationOnce: [Function (anonymous)],
  //           mockImplementation: [Function (anonymous)],
  //           mockReturnThis: [Function (anonymous)],
  //           mockName: [Function (anonymous)],
  //           getMockName: [Function (anonymous)]
  //         }
  //       }
  //     }

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
