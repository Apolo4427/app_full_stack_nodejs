// configuracion de coneccion a la base de datos

const mysql = require('mysql2'); // importa y devuelve el objeto que el módulo expone
require('dotenv').config();

const connection = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database: process.env.DB_NAME 
    }
);

connection.connect((err) =>{
    if (err){
        console.log("Error al conectar a la base de datos: ", err);
    }
    console.log("conexion exitosa..."); // no es necesario el else por que esta en la misma gerarquia del if 
})


module.exports = connection;