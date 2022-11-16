import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
const SERVER_PORT = 3001;
import routes from "./routes/index";
// import cors from "cors";

createConnection().then(async connection => {

    // create express app
    const app = express();
    const cors = require("cors")
    const fileUpload = require("express-fileupload");



    // middleware
    app.use(fileUpload())
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cors())


    app.use('/', routes)
// app.use('/', (rq, rs) => {
//     console.log('received request', rq.params, rq.query)
//     const {name, phone, email} = rq.query //destructuring
//     rs.send(`hi backend server :), your name: ${name}, phone:${phone}`)
// })
    // register express routes from defined application routes
    // Routes.forEach(route => {
    //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //         const result = (new (route.controller as any))[route.action](req, res, next);
    //         if (result instanceof Promise) {
    //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
    //
    //         } else if (result !== null && result !== undefined) {
    //             res.json(result);
    //         }
    //     });
    // });

    // setup express app here
    // ...

    // start express server
    app.listen(SERVER_PORT);

    // insert new users for test
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Timber",
    //     lastName: "Saw",
    //     age: 27
    // }));
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Phantom",
    //     lastName: "Assassin",
    //     age: 24
    // }));

    console.log(`Express server has started on port ${SERVER_PORT}. Open http://localhost:${SERVER_PORT} to see results`);

}).catch(error => console.log(error));
