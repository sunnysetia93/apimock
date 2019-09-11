import * as handlers from './handlers';

let routes = [
  {
    method: 'GET',
    path: '/wallet',
    handler: handlers.getHandler
  },
  {
    method:'POST',
    path:'/wallet',
    handler:handlers.postHandler
  },
  {
    method:'PUT',
    path:'/wallet',
    handler:handlers.updateHandler
  },
  {
    method:'DELETE',
    path:'/wallet',
    handler:handlers.removeHandler
  },
  {
    method:'POST',
    path:'/wallet/query',
    handler:handlers.queryHandler
  },
  {
    method:'POST',
    path:'/wallet/query/custom',
    handler:handlers.queryHandler_custom
  }
];

export default routes;
