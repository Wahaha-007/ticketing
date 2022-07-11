const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

// LandingPage.getInitialProps = async ({ req }) => {
//   if (typeof window === 'undefined') {
//     // we are on the server!

//     // requests should be made to http://ingress-nginx.ingress-nginx...laksdjfk
//     const { data } = await axios.get(
//       'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
//       {
//         // Nginx also needs domain name information !
//         // headers: { Host: 'ticketing.dev' },
//         headers: req.headers,
//       }
//     );

//     return data;
//   } else {
//     // we are on the browser!

//     const { data } = await axios.get('/api/users/currentuser'); // response.data

//     return data;
//   }
// };

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
