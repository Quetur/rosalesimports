import jwt from "jsonwebtoken";
import {promisify} from "util";
import bcryptjs from "bcryptjs";
import pool from "../database.js";
import dotenv from 'dotenv'
dotenv.config({path: './env/.env'})


//console.log( "variables",process.env.JWT_SECRETO, process.env.DB_CONNECTIONLIMIT,process.env.DB_HOST,process.env.DB_USER,process.env.DB_PASS,process.env.DB_DATABASE,process.env.DB_PORT)



export const isAuthenticated = async (req, res, next) => {
  console.log('isauthenticated en authcontroler')
  // pruebo cambio jwt por oficio
  if (req.cookies.jwt) {
    console.log("hay cookie")
    try {
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETO
      );
      console.log("decodificada para usuario: ", decodificada.id);
      //console.log("req", req)
      
      try {
        const [pp] = await pool.query("SELECT * FROM usuario WHERE dni = ?", [decodificada.id])
        console.log("pepe", pp[0].nombre)
        req.user = pp[0];
      } catch (error) {
        console.log(error);
      }


      return next();
     
     
    } catch (error) {
      console.log(error);
      return next();
    }
  } 
  else {
    console.log("no hay cokie")
      res.redirect("/home");
  
  }
};


export const salir = async (req, res) => {
  console.log("authcontroller salir")
  //res.clearCookie("jwt");
  //res.render("logout");
  //return res.redirect("/logout");
  res.clearCookie("jwt");
  //res.end()
  res.render("logout",{ user: false});
};


export const home = async (req, res)=>{  
  console.log('authcontroler home') 
//  listarUsuarios()
  return res.redirect('/home')
   // res.redirect("/lista10",{ user: false });
}

export const listado= async (req, res)=>{  
  console.log('authcontroler listado') 
  return res.redirect('/lista')

}

export const listado2= async (req, res)=>{  
  console.log('authcontroler listado2') 
  return res.redirect('/lista2')
}


export const listado3= async (req, res)=>{  
  console.log('authcontroler listado3') 
  return res.redirect('/lista3')
}

export const listado4= async (req, res)=>{  
  console.log('authcontroler listado4') 
  return res.redirect('/lista4')
}

export const listado5= async (req, res)=>{  
  console.log('authcontroler listado5') 
  return res.redirect('/lista5')
}

export const listado6= async (req, res)=>{  
  console.log('authcontroler listado6') 
  return res.redirect('/lista6')
}
export const listado7= async (req, res)=>{  
  console.log('authcontroler listado7') 
  return res.redirect('/lista7')
}

export const listado8= async (req, res)=>{  
  console.log('authcontroler listado8') 
  return res.redirect('/lista8')
}

export const listado9= async (req, res)=>{  
  console.log('authcontroler listado9') 
  return res.redirect('/lista9')
}

export const listado10= async (req, res)=>{  
  console.log('authcontroler listado10') 
  return res.redirect('/lista10')
}

export const listado11= async (req, res)=>{  
  console.log('authcontroler listado11') 
  return res.redirect('/lista11')
}

export const listado12= async (req, res)=>{  
  console.log('authcontroler listado12') 
  return res.redirect('/lista12')
}

export const archivo= async (req, res)=>{  
  console.log('authcontroler archivo0') 
  return res.redirect('/formarchivo0')
}

export const listarinmuebles = async (req, res) => {
  console.log("listar inmuebles ");
  try {
    const [results]  = await pool.query(`SELECT * FROM inmuebles`);
    console.log ("cantidad de resultados", results.length)
    console.log("encontro", results[0].dni)
    let registro = results[0]
    if (results.length=0) {
       console.log("no hay dni");
       return next();
    } 
    else {
      console.log("registro", registro)
     // console.log("duplicado", registro.dni, registro.nombre);
      let lin =`{"dni": "` +
            registro.dni +
            `", "nombre": "` +
            registro.nombre +
            `"}`;
          let obj = JSON.parse(lin);
          console.log(obj);
          //res.json(obj);
    }
  }
  catch (error) {
    console.log(error);
  }
}

export const recuperoUSR = async (req, res, next) => {
  console.log('irecuperoUSR'.req)
  // pruebo cambio jwt por oficio
  if (req.cookies.jwt) {
    console.log("hay cookie")
    try {
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETO
      );
      console.log("decodificada para usuario: ", decodificada.id);
      //console.log("req", req)
      
      try {
        const [pp] = await pool.query("SELECT * FROM usuario WHERE dni = ?", [decodificada.id])
        console.log("pepe", pp[0].nombre)
        req.user = pp[0];
        return req.usr
      } catch (error) {
        console.log(error);
      }


      return next();
     
     
    } catch (error) {
      console.log(error);
      return next();
    }
  } 
  else {
    console.log("no hay cokie")
      res.redirect("/home");

  }
};

