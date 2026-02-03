import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import pool from "../database.js";
import { promisify } from 'util';
import AWS from "aws-sdk";
import fs from "fs";
import bcryptjs from "bcryptjs";
import passport from '../lib/passport.js'; // Asegúrate de incluir la extensión .js

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

router.get("/", async (req, res) => {
  console.log("router / get / ", req.user);
  res.render("index",   );
});

const usuario = () => {
console.log("entro en usuario")
//  const token = sessionStorage.getItem("token");
//console.log("token detro de usuario", token)
  // Retorna true si el token existe, false si es null o undefined
 // return !!token;
};

async function estalogueado(caracteres) {
  console.log("router estalogueado()", process.env.JWT_SECRETO);
  console.log("caraceres a decodificar ", caracteres);
  try {
    const decodificada = await promisify(jwt.verify)(
      caracteres,
      process.env.JWT_SECRETO
    );
    console.log("decodificada para usuario: ", decodificada.id);
    //console.log("req", req)

    try {
      const [pp] = await pool.query("SELECT * FROM usuario WHERE dni = ?", [
        decodificada.id,
      ]);

      return pp[0];
    } catch (error) {
      console.log("el error es", error);
    }

    return;
  } catch (error) {
    console.log("el error es 2", error);

    return;
  }
}
//module.exports = router;

function grabarlocalstorage(dni, nombre) {
  console.log("entro en grabarlocalstorage", dni, " ", nombre);
  localStorage.clear();
  let usr = "";
  let lin = `{"dni": "` + dni + `", "nombre": "` + nombre + `"}`;
  localStorage.setItem("usr", JSON.stringify(lin));
  //document.getElementById('items').value = productos.length;
}

router.get("/home", async (req, res) => {
  console.log("router /home");
  try {
    console.log("resultados de req.cookies.jwt", req.cookies.jwt);

    if (req.cookies.jwt != undefined) {
      console.log("tiene cookies");
      try {
        req.user = await estalogueado(req.cookies.jwt);
        console.log("req.user", req.user.dni);
        console.log("req.usr ", req.user.nombre);
        if (req.user) {
          console.log(
            "existe user router/home",
            req.user.nombre,
            req.user.imagen,
            req.user.dni
          );
          res.render("lista18", {
            user: req.user.nombre,
            logo: req.user.imagen,
            userid: req.user.dni,
          });
          //res.render("lista10",{ user: req.user});
          //res.render("home", { registro: results, user: req.user });
        } else {
          console.log("NO esta adentro router/home");
          //res.render("home", { registro: results, user: false });
          // lo saco para probar 5/8 res.render("lista18",{ user: false});
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("no tiene cookies");
      //res.render("lista10",{ user: false});
      res.render("lista18", { user: false });
      //res.render("home", { registro: results, user: false });
    }

    //console.log("usuario registrado", req.user.nombre )
  } catch (error) {
    {
      console.log(error);
    }
  }
});

function validateToken(req, res, next) {
  console.log("validate token");
  const { user } = req.body;
  /*
  const accessToken = req.headers['autorization']
  if(!accessToken) {
    res.send('acceso denegado')
  }

*/
}

router.post("/login", async (req, res, next) => {
  console.log("ejecuto login router");
  console.log("req.dni", req.body.dni);
  console.log("req.pass", req.body.pass);
  try {
    const dni = req.body.dni;
    const pass = req.body.pass;
    console.log("dni y pass", dni);
    if (!dni || !pass) {
      res.render("signin", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y password",
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: "",
      });
    } else {
      console.log("entro aca");
      try {
        const [results, fields] = await pool.query(
          `SELECT * FRom usuario WHERE dni = ?`,
          dni
        );
        console.log("encontro", results.length);
        console.log("encontro", results[0]);
        //res.json(result);
        if (
          results.length == 0 ||
          !(await bcryptjs.compare(pass, results[0].pass))
        ) {
          console.log("usuario o password incorrecto");
          res.render("signin", {
            alert: true,
            alertTitle: "No se pudo ingresar",
            alertMessage: "¡usuario o password incorrectos",
            alertIcon: "error",
            showConfirmButton: true,
            timer: 10000,
            ruta: "signin",
            user: "",
            dni: "",
            apellido: "",
            logo: "",
          });
        } else {
          //inicio de sesión OK
          console.log("inicio ok");
          const id = results[0].dni;
          console.log(id);
          console.log("else esto es results[0]", results[0]);
          req.user = results[0];
          // jwt es la libreria
          const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA,
          });
          //generamos el token SIN fecha de expiracion
          //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
          console.log("TOKEN: " + token + " para el USUARIO : " + dni);
          //grabarlocalstorage(dni, results[0].nombre);
         // res.json({ mensaje: "Logueado" });
          const cookiesOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          //res.cookie("jwt", token, cookiesOptions);
          let usr = results[0].nombre;
          let apellido = results[0].direccion;

          console.log("router 77 - results[0].nombre = ", usr);
          //sessionStorage.setItem('token_acceso', token);
          // Convertir objeto a string para guardarlo
          //const perfil = { nombre: "Alex", rol: "admin" };
          //sessionStorage.setItem('sesion_activa', JSON.stringify(perfil));
          console.log("router 210")
          passport.authenticate("local.signin", {
            successRedirect: "/profile",
            failureRedirect: "/signin",
            failureFlash: true,
          })(req, res, next);
          //console.log("antes de renderizar", pppp);
          // res.render("index", { usr, apellido });
          console.log("router 218")
          res.render("profile",{
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1000,
            ruta: "/profile",
            dni: dni,
            nombre: usr,
            token: token,
            logo: results[0].imagen,
            userid: dni   })
        }
      } catch (error) {
        console.log(error);
        //return res.status(500).json({ message: error.message });
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log("salio router 240")

});

export const verificarEstado = (req, res, next) => {
  const token = req.cookies.mi_token; // Usando cookies como mencioné arriba
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRETO);
    res.locals.nombreUsuario = decoded.nombre; // Esto lo lee HBS
    res.locals.isAuth = true;
  } else {
    res.locals.isAuth = false;
  }
  next();
};

export default router;
