var express = require('express');
var app = express();
var rows = require('../config/config').ROWS_POR_PAG;
var mdAuthenticationJWT = require('../middlewares/authentication');
//variable de conexion a postgres
const pool = require('../config/db');

//datos de funcion crud general
var crud = require('../funciones/crud_operaciones');
//DATOS DE LA TABLA
var datos_tabla = {
    tabla_target: 'perfil_usuario',
    pk_tabla: 'pk_perfil',
    sp_crud_tabla: 'sp_salud_crud_perfil_usuario'
}

//Rutas
// ==========================================
// Obtener todos los registros acorde al usuario
// ========================================== 
app.get('/:user', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_user = req.params.user;
    pk_user = Number(pk_user);

    consulta = `SELECT p.pk_perfil,
    p.nombre_perfil,
    (CASE WHEN(SELECT COUNT(*) FROM perfil_usuario pu WHERE p.pk_perfil=pu.pk_perfil AND pu.pk_user=${pk_user}) = 0 THEN FALSE ELSE TRUE END) as existe_perfil  
    FROM perfil p ORDER BY p.nombre_perfil ASC`;

    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

//Rutas
// ==========================================
// Obtener todos los registros acorde al usuario
// ========================================== 
app.get('/:user', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_user = req.params.user;
    pk_user = Number(pk_user);

    consulta = `SELECT p.pk_perfil,
    p.nombre_perfil,
    (CASE WHEN(SELECT COUNT(*) FROM perfil_usuario pu WHERE p.pk_perfil=pu.pk_perfil AND pu.pk_user=${pk_user}) = 0 THEN FALSE ELSE TRUE END) as existe_perfil  
    FROM perfil p ORDER BY p.nombre_perfil ASC`;

    crud.getAll(datos_tabla.tabla_target, consulta, res);
});



// ==========================================
// Ejecutar Crud acorde a parametro 
// ========================================== 
app.post('/', mdAuthenticationJWT.verificarToken, (req, res) => {

    //Recibo los datos en el body y con el body parser me lo transforma a JSON
    var body = req.body;
    consulta = `SELECT * FROM ${datos_tabla.sp_crud_tabla} ($1,$2)`;
    crud.crudBasico(datos_tabla.tabla_target, consulta, body, res);

});


module.exports = app;