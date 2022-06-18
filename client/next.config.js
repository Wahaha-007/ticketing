// The purpose of this file is to correct the propblem that
// NextJS does not reflect the update in source file.

// Change from 'Watch' mode to 'Polling' mode

module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
