import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
  //client
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '1234',
    title: 'concert',
    price: 20,
  });

  // 3rd param = callback after publish data
  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});
