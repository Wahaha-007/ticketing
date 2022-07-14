// This helper function is made in order to make index.js more tidy !
import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      baseURL:
        //  'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        'http://www.mmm-tickets-prod.xyz',
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
};
