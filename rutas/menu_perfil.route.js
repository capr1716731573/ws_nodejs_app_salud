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
    tabla_target: 'menu_perfil',
    pk_tabla: 'pk_menuperfil',
    sp_crud_tabla: 'sp_salud_crud_menu_perfil'
}

//Rutas

// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:id_perfil', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id_perfil;
    //consulta si existen un registro del existente
    consulta = `SELECT * FROM sp_salud_getmenubyperfil(${ id })`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getAll(datos_tabla.tabla_target, consulta, res);

});

//Rutas

// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/byUser/:id_user', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id_user;
    //consulta si existen un registro del existente
    consulta = `SELECT * FROM sp_salud_getmenubyuser(${ id })`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getAll(datos_tabla.tabla_target, consulta, res);

});


// ==========================================
// Ejecutar Crud acorde a id_perfil
// ========================================== 
app.post('/', mdAuthenticationJWT.verificarToken, (req, res) => {

    //Recibo los datos en el body y con el body parser me lo transforma a JSON
    var body = req.body;
    consulta = `SELECT * FROM ${datos_tabla.sp_crud_tabla} ($1,$2)`;
    crud.crudBasico(datos_tabla.tabla_target, consulta, body, res);

});


module.exports = app;