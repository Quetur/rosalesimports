import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { create } from 'express-handlebars';
import { engine } from 'express-handlebars'; 

import flash from 'connect-flash'; // mensajes de alerta
import validator from 'express-validator';
//const MySQLStore = require('express-mysql-session')(session);
import  bodyParser from 'body-parser';
import  nodemailer from 'nodemailer';
import express from 'express';
import cors from 'cors';
//import router from './routes/router.js'; // Note the mandatory .js extension in ESM

import AWS from 'aws-sdk';
import fs  from 'fs';
import dotenv  from 'dotenv'

import 'dotenv/config';
import jwt from "jsonwebtoken";
import { verificarToken } from './views/auth/auth.js';

// Intializations
const app = express();
app.use(cors()); // Permite que tu frontend se comunique con el backend
import session from 'express-session';

const SECRET = process.env.JWT_SECRETO || 'llave_secreta_provisional';
// ... (configuración de tu app Express)

app.use(session({
  secret: 'mi_secreto_ultra_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Cambiar a true si usas HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 día de duración
  }
}));

import cookieParser from 'cookie-parser';
app.use(cookieParser());






// Settings
console.log("process.env.PORT ", process.env.PORT)
app.set('port', process.env.PORT || 4000);


app.set('views', path.join(__dirname, 'views'));


const hbs = create({
  extname: '.hbs',          // Specify the file extension
  defaultLayout: 'main',    // Specify the default layout file (e.g., main.hbs)
  layoutsDir: './src/views/layouts/', // Specify the layouts directory
  partialsDir: './src/views/partials/' // Specify the partials directory
});

app.engine('.hbs', engine({
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Esto permite leer los datos de la BD
        allowProtoMethodsByDefault: true,
    },
}));

// Set the view engine to hbs
//app.set('view engine', '.hbs');

console.log("layout ",  path.join(app.get('views'), 'layouts'))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(session({
  secret: 'jesus', //
  resave: false,
  saveUninitialized: false,
}));

/*


app.use(flash());
// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



*/
import passport from 'passport';
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());
//app.use(nodemailer.createTransport);

/*// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});
*/
// Routes
//const routes = require('./src/routes/routes.js');
//app.use(router);
//import router from './routes/authentication.js'; // Note the mandatory .js extension in ESM
//app.use(router);

import router  from "./routes/router.js";
app.use("/", router);


import authRouter from './routes/authentication.js';

// ... resto de tu configuración ...

// 2. Úsalo en tu app
app.use(authRouter); 


console.log('paso index')
//console.dir(app)

//import linksRouter from './routes/links.js'; // Ensure the .js extension is present
//app.use('/links', linksRouter);

// se encarga de entender los datos que le envio desde el formulario
app.use(express.urlencoded({extended: false})); 

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});
