import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

// We use our custom 'thin' wrapper for every component shown on the screen
// This _app.js file will overwrite default wrapper

const AppComponent = ({ Component, pageProps, currentUser }) => {
  // Component = signin, signup ... page
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // --------- My Real Task HERE -------------
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // --------- Additional task that _app.js work for eacha page --------
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  // -------------------------------------------------------------------

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
