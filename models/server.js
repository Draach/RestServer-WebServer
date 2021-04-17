const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.authPath = '/api/auth';        // step 1 - Path generation 
        this.usersPath = "/api/users";
        
        // Database connection
        this.dbConnect();

        // Middlewares
        this.middlewares();

        // App routes
        this.routes();
    }

    async dbConnect() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // body read & parse
        this.app.use( express.json() );

        // public directory as default path "/"
        this.app.use( express.static('public'));

    }

    routes() {

        this.app.use(this.authPath, require('../routes/auth'));     // step 2 - path definition
        this.app.use(this.usersPath, require('../routes/users'));   // path definition 

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log("Servidor corriendo en puerto", this.port);
        })
    }
}


module.exports = Server;