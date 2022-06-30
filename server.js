import 'dotenv/config'
import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { messageDao } from "./src/daos/index.js"
import { logger } from './src/utils/logger.js';
import session from "express-session";
import MongoStore from "connect-mongo";
import config from "./src/utils/config.js";
import passport from "passport";
import cluster from 'cluster';
import compression from 'compression';

import * as os from 'os';

import home from "./src/routes/home.js";
import login from "./src/routes/login.js";
import loginError from "./src/routes/login-error.js";
import info from "./src/routes/info.js";
import register from './src/routes/register.js';
import randoms from './src/routes/randoms.js';
import logout from './src/routes/logout.js';
import fbAuth from './src/auth/fb-auth.js';
import localAuth from './src/auth/local-auth.js';

const clusterMode = process.argv[3] == 'CLUSTER';

if (clusterMode && cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master cluster setting up ${numCPUs} workers`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {

    const app = express();

    const PORT = parseInt(process.argv[2]) || 8080;

    const httpServer = new HttpServer(app);
    const io = new IOServer(httpServer);
    const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        fbAuth();
        localAuth();
    }
    catch (err) {
        console.log(err);
    }

    app.use(session({
        store: MongoStore.create({ mongoUrl: config.mongodb.url, mongoOptions: advancedOptions }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: { maxAge: 60000 * 10 }
    }));
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(compression());

    app.use("/login-error", loginError);
    app.use("/login", login);
    app.use("/home", home);
    app.use("/info", info);
    app.use("/register", register);
    app.use("/logout", logout);
    app.use("/api/randoms", randoms);

    io.on("connection", async (socket) => {
        socket.emit("messages", await messageDao.listarTabla());
        socket.on("new-message", async (message) => {

            await messageDao.insertarArticulo(message, "messages");
            socket.emit("messages", await messageDao.listarTabla());
        });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login-error', successRedirect: '/home', authType: 'reauthenticate' }));

    app.get('/', (req, res) => {
        res.redirect('/login')
    });

    app.get('*', (req, res) => {
        logger('warn', "Page not found");
        res.status(404).send('404 Not Found');
    })

    const server = httpServer.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });

    server.on("error", (error) => {
        console.log(error);
    });
}


