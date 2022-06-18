import 'bootstrap/dist/css/bootstrap.css';

// We use our custom 'thin' wrapper for every component shown on the screen
// This _app.js file will overwrite default wrapper

export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
