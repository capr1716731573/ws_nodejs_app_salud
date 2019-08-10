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
    tabla_target: 'agenda',
    pk_tabla: 'pk_age',
    sp_crud_tabla: 'sp_salud_crud_agenda'
}

var consulta_base = ` SELECT
                a.pk_age,
                a.pk_ubigeo,
                a.nombres_age,
                a.apellidos_age,
                a.fecha_age,
                a.hora_age,
                a.medio_age,
                a.telefono_age,
                a.celular_age,
                (select * from sp_salud_getgeografia(a.pk_ubigeo)) as geografia_agenda 
                from agenda a`

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    consulta = `${consulta_base} order by fecha_age ASC, hora_age ASC, nombres_age ASC, apellidos_age ASC`;

    crud.getAll(datos_tabla.tabla_target, consulta, res);
});


// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:pk_age', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_age = req.params.pk_age;
    //valido que exista el parametro "desde"
    consulta = `${consulta_base} WHERE a.pk_age=${pk_age} order by fecha_age ASC, hora_age ASC, nombres_age ASC, apellidos_age ASC`;
    //LLamo al archivo CRUD OPERACIONES
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