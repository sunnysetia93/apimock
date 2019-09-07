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
  },
  {
    method:'GET',
    path:'/dynamicdelay/volatile',
    handler:handlers.dynamicDelayHandler
  },
  {
    method:'GET',
    path:'/dynamicdelay',
    handler:handlers.dynamicDelayHandler_redis
  }
];

export default routes;
