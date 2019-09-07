'use strict';
import config from './config';
const Hapi = require('hapi');
const mongoose = require('mongoose');

import './models/Wallet';
import './models/init';
import routes from './api';


mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI,{ useNewUrlParser: true });

// Create a server with a host and port
const server = Hapi.server({ 
    host: 'localhost', 
    port: 8001
});
// Add the route
server.route(routes);

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();