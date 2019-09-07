import testRoutes from './testapis'; 
import prodRoutes from './prodapis'; 
import walletRoutes from './walletapis';

let routes = [];
routes.push(...testRoutes);
routes.push(...prodRoutes);
routes.push(...walletRoutes);

export default routes;