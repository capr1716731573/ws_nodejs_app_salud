var express = require('express');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

//variable de conexion a postgres
const pool = require('../config/db');

//Importo Middlewar
//var mdAutenticacion = require('../middlewares/authentication');

//=====================================================
//Auntenticacion Normal
//=====================================================
app.post('/', (req, res) => {
    var body = req.body;

    var usuario = {
        user: body.user,
        password: body.password
    };

    //consulta si existen un registro del existente
    consulta = `SELECT * FROM usuario usu INNER JOIN persona p on usu.pk_person = p.pk_person
    WHERE usu.visible_user=true AND usu.usuario_user= $1`

    //1.- verificamos si existe un usuario con ese correo electronico

    pool.query(consulta, [usuario.user], (err, response) => {

        //error al buscar usuario en la DB o en el servidor
        if (err) {
            return res.status(500).json({
                status: 'error',
                mesaje: 'Error al buscar usuario - Server',
                errors: err
            });
        }

        //Controla sino encuentra el usuario en la Base de Datos
        if (response.rowCount === 0) {
            return res.status(400).json({
                status: 'error',
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }
        console.log(response);
        //Si hay valores escojo el primero, ya que si busco uno es xq debe serv unico
        var usuarioDB = response.rows[0];


        //var pass = response.rows[0].password;
        //verificaos contrasena - compara un string con otro que ya utilizo el bcrypt
        if (!bcryptjs.compareSync(usuario.password, usuarioDB.password_user)) {
            return res.status(400).json({
                status: 'error',
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        console.log('Son iguales');

        //creo el token
        //1.-Instalamos jsonwebtoken --->  npm install jsonwebtoken --save
        //var token = jwt.sign({ PAYLOD o cuerpo del token }, 'SEMILLA O PARABRA QUE SE ENCIPTA PARA GENERAL EL TOKEN', { expiresIn: FECHA DE EXPIRACION DEL TOKEN })
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })

        res.status(200).json({
            status: 'ok',
            usuario: usuarioDB,
            token: token, // con este valor vamos a la pagina del jsonwebtoken y nos muestra lo que dice todo es codigo del jsonwebtoken y si es valido o no
            id: usuarioDB._id,
            //menu: obtenerMenu(usuarioDB.role)
        });
    });



});

module.exports = app;