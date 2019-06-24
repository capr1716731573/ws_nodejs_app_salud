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
    tabla_target: 'cie_10',
    pk_tabla: 'pk_cie',
    sp_crud_tabla: 'sp_salud_crud_cie10'
}

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var desde = req.query.desde;
    desde = Number(desde);
    var consulta;
    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `SELECT * FROM ${ datos_tabla.tabla_target } ORDER BY codigo_cie ASC LIMIT ${ rows } OFFSET ${ desde }`;
    } else {
        consulta = `SELECT * FROM ${ datos_tabla.tabla_target } ORDER BY codigo_cie ASC`;
    }
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

// ==========================================
// Obtener todos los registros busqueda avanzada por parametros
// ========================================== 
app.get('/busqueda/:busqueda', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var busqueda = req.params.busqueda;
    var consulta;
    //valido que exista el parametro "desde"
    consulta = `SELECT * FROM ${ datos_tabla.tabla_target } WHERE nombre_cie LIKE '%${busqueda}%' OR codigo_cie LIKE '%${busqueda}%'`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});



// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:id', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id;
    //consulta si existen un registro del existente
    consulta = `SELECT * FROM ${ datos_tabla.tabla_target } WHERE ${datos_tabla.pk_tabla}= ${ id }`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, id, consulta, res);

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