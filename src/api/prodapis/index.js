import * as handlers from './handlers';

let routes = [
  {
    method: 'GET',
    path: '/loop',
    handler: handlers.loop
  },
  {
    method:'POST',
    path:'/csv2json',
    handler:handlers.csv2jsonHandler,
    options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      }
    }
  }
];

export default routes;
