import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import pool from '../database.js';
import bcryptjs from "bcryptjs";


//mailField: 'mail',mail,
passport.use('local.signin', new LocalStrategy({
  usernameField: 'dni',  
  passwordField: 'pass',
  passReqToCallback: true
}, async (req, dni,pass, done) => {
  const [rows] = await pool.query(`SELECT * FRom usuario WHERE dni = ?`, [dni]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await bcryptjs.compare(pass, rows[0].pass)
    console.log("valid password", validPassword)
    if (validPassword) {
      console.log("passport 20", user.nombre)
      //done(null, user, req.flash('success', 'Los Rosales te da la bienvenida ' + user.nombre));
    } else {
      done(null, false, req.flash('message', 'Contraseña Incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'El Usuario '+[username]+' NO EXISTE !!!!.'));
  }
}));
//,mail, mail,
console.log("passport 30")
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username', 
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username,  password, done) => {

  const { fullname } = req.body;
  const { mail } = req.body;
  let newUser = {  
    username,    
    password,
    fullname,
    mail
    
  };

  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const [result] = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id_users = result.insertId;
  console.log(newUser)
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id_users);
});

passport.deserializeUser(async (id_users, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id_users = ?', [id_users]);
  done(null, rows[0]);
});

passport.use('local.producto', new LocalStrategy({
  
  /*usernameField: 'username',  
  passwordField: 'password',
  passReqToCallback: true*/
}, async (req, done) => {
  console.log('passport');
  const rows = await pool.query('SELECT * FROM producto');
  if (rows.length > 0) {
    const user = rows[0];   
      return done(null, req.flash('success', rows));
    
  } else {
    return done(null, null);
  }
}));

export default passport;
