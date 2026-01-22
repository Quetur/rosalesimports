import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { create } from 'express-handlebars';
import { engine } from 'express-handlebars'; 
import session from 'express-session';
import flash from 'connect-flash'; // mensajes de alerta
import validator from 'express-validator';
//const MySQLStore = require('express-mysql-session')(session);
import  bodyParser from 'body-parser';
import  nodemailer from 'nodemailer';
import express from 'express';
//import router from './routes/router.js'; // Note the mandatory .js extension in ESM

import AWS from 'aws-sdk';
import fs  from 'fs';
import dotenv  from 'dotenv'

import 'dotenv/config';


// Intializations
const app = express();
//require('./lib/passport');


// Settings
console.log("process.env.PORT ", process.env.PORT)
app.set('port', process.env.PORT || 4000);


app.set('views', path.join(__dirname, 'views'));

/*app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}
))
*/
const hbs = create({
  extname: '.hbs',          // Specify the file extension
  defaultLayout: 'main',    // Specify the default layout file (e.g., main.hbs)
  layoutsDir: './src/views/layouts/', // Specify the layouts directory
  partialsDir: './src/views/partials/' // Specify the partials directory
});

// Register the handlebars engine with the Express app
//app.engine('.hbs', hbs.engine);
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
/*
app.use(session({
  secret: 'sessionsecreta ',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));

app.use(flash());
// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(flash());

*/
//app.use(passport.initialize());
//app.use(passport.session());
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
