import * as handlers from './handlers';

let routes = [
  {
    method: 'GET',
    path: '/hello',
    handler: handlers.hello
  }
];

export default routes;
