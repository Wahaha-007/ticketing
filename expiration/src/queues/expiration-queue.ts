import Queue from 'bull';

// 1. Define main Job (Message)
interface Payload {
  orderId: string;
}

// 2. Define Main Job Management Object ( 1.Param for Queueing )
//    - Job Type
//    - Job Group (Channel)
//    - Server location

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// 3. Define (2.Job processing )
expirationQueue.process(async (job) => {
  console.log(
    'I want to publish an expiration:complete event for orderId',
    job.data.orderId
  );
});

export { expirationQueue };
