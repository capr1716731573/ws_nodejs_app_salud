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
    tabla_target: 'regiones',
    pk_tabla: 'pk_regexa',
    sp_crud_tabla: 'sp_salud_crud_regiones_tipexa'
}

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:pk_tipexa', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_tipexa = req.params.pk_tipexa;
    var consulta;
    consulta = "select * from regiones r INNER JOIN tipo_examen t on r.pk_tipexa = t.pk_tipexa  where r.pk_tipexa=" + pk_tipexa + "  order by r.nombre_regexa";
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});


// ==========================================
// Obtener todos los registros ACTIVOS
// ========================================== 
app.get('/activos/:pk_tipexa', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_tipexa = req.params.pk_tipexa;
    var consulta;
    consulta = "select * from regiones r INNER JOIN tipo_examen t on r.pk_tipexa = t.pk_tipexa  where r.pk_tipexa=" + pk_tipexa + " AND r.activo_regexa=TRUE order by r.nombre_regexa";
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});


// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:pk_regexa/:pk_tipexa', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var pk_regexa = req.params.pk_regexa;
    var pk_tipexa = req.params.pk_tipexa;
    //consulta si existen un registro del existente
    consulta = "select * from regiones r INNER JOIN tipo_examen t on r.pk_tipexa = t.pk_tipexa " +
        "WHERE r.pk_tipexa=" + pk_regexa + " r.pk_regexa=" + pk_tipexa + "  order by r.nombre_regexa";
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