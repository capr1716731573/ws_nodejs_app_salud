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
    tabla_target: 'tipo_vacuna',
    pk_tabla: 'pk_tipvac',
    sp_crud_tabla: 'sp_salud_crud_tipo_vacuna'
}

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:pk_tipcap', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_tipcap = req.params.pk_tipcap;
    var consulta;
    consulta = "select * from tipo_vacuna tp INNER JOIN captacion_vacunas v on tp.pk_tipcap = v.pk_tipcap where v.pk_tipcap=" + pk_tipcap + "  order by tp.nombre_tipvac";
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

// ==========================================
// Obtener todos los registros ACTIVOS
// ========================================== 
app.get('/activos/:pk_tipcap', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_tipcap = req.params.pk_tipcap;
    var consulta;
    consulta = "select * from tipo_vacuna tp INNER JOIN captacion_vacunas v on tp.pk_tipcap = v.pk_tipcap where v.pk_tipcap=" + pk_tipcap + " AND tp.activo_tipvac=true  order by tp.nombre_tipvac";
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});



// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:pk_tipvac/:pk_tipcap', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var pk_tipvac = req.params.pk_tipvac;
    var pk_tipcap = req.params.pk_tipcap;
    //consulta si existen un registro del existente
    consulta = "select * from tipo_vacuna tp INNER JOIN captacion_vacunas v on tp.pk_tipcap = v.pk_tipcap " +
        "where tp.pk_tipvac=" + pk_tipvac + " tp.pk_tipcap=" + pk_tipcap + "  order by tp.nombre_tipvac";
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