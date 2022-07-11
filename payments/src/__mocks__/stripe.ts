export const stripe = {
  charges: {
    // Make a function that return Promise that will resolve into Empty object
    create: jest.fn().mockResolvedValue({}),
  },
};
