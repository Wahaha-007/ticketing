// Version 1 : Can make the test pass but check no event publishing
// export const natsWrapper = {
//   client: {
//     publish: (subject: string, data: string, callback: () => void) => {
//       callback();
//     },
//   },
// };

// Version 2 : With the event publishing check function

export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
