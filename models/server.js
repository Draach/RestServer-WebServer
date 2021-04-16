const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = "/api/users";
        
        // Database connection
        

        // Middlewares
        this.middlewares();

        // App routes
        this.routes();
    }
    dbConnect();
    async dbConnect() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // body read & parse
        this.app.use( express.json() );

        // public directory
        this.app.use( express.static('public'));

    }

    routes() {

        this.app.use(this.usersPath, require('../routes/users'));

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log("Servidor corriendo en puerto", this.port);
        })
    }
}


module.exports = Server;