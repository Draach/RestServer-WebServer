const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: "/api/auth",
            categories: "/api/categories",
            products: "/api/products",
            users: "/api/users",
        }
        
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

        this.app.use(this.paths.auth, require('../routes/auth'));     // step 2 - path definition
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.users, require('../routes/users'));   // path definition 

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log("Servidor corriendo en puerto", this.port);
        })
    }
}


module.exports = Server;