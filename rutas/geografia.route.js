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
    tabla_target: 'geografia',
    pk_tabla: 'pk_ubigeo',
    sp_crud_tabla: 'sp_salud_crud_ubicacion_geografica'
}

var consulta_parroquia = "SELECT " +
    "n.pk_ubigeo as pk_pais," +
    "n.nombre_ubigeo as nombre_pais," +
    "p.pk_ubigeo as pk_provincia," +
    "p.nombre_ubigeo as nombre_provincia," +
    "c.pk_ubigeo as pk_ciudad," +
    "c.nombre_ubigeo as nombre_ciudad," +
    "pr.pk_ubigeo as pk_parroquia," +
    "pr.nombre_ubigeo as nombre_parroquia " +
    "FROM geografia pr " +
    "INNER JOIN geografia c " +
    "INNER JOIN geografia p " +
    "INNER JOIN geografia n ON p.fk_padre=n.pk_ubigeo " +
    "ON c.fk_padre=p.pk_ubigeo " +
    "ON pr.fk_padre=c.pk_ubigeo " +
    "WHERE pr.tipo_ubigeo='PR' and pr.pk_ubigeo="

var consulta_ciudad = "SELECT " +
    "n.pk_ubigeo as pk_pais," +
    "n.nombre_ubigeo as nombre_pais," +
    "p.pk_ubigeo as pk_provincia," +
    "p.nombre_ubigeo as nombre_provincia," +
    "c.pk_ubigeo as pk_ciudad," +
    "c.nombre_ubigeo as nombre_ciudad " +
    "FROM geografia c " +
    "INNER JOIN geografia p " +
    "INNER JOIN geografia n ON p.fk_padre=n.pk_ubigeo " +
    "ON c.fk_padre=p.pk_ubigeo " +
    "WHERE c.tipo_ubigeo='C' and c.pk_ubigeo="

var consulta_provincia = "SELECT " +
    "n.pk_ubigeo as pk_pais," +
    "n.nombre_ubigeo as nombre_pais," +
    "p.pk_ubigeo as pk_provincia," +
    "p.nombre_ubigeo as nombre_provincia " +
    "FROM geografia p " +
    "INNER JOIN geografia n ON p.fk_padre=n.pk_ubigeo " +
    "WHERE p.tipo_ubigeo='P' and p.pk_ubigeo=";

var pk_pais = 74 //Se refiere a ECUADOR

var consultaTodosXPais = "SELECT pk_ubigeo,nombre_ubigeo,fk_padre, " +
    " (CASE tipo_ubigeo" +
    "      WHEN 'N' THEN 'PAÍS'" +
    "      WHEN 'P' THEN 'PROVINCIA'" +
    "      WHEN 'C' THEN 'CIUDAD'" +
    "      WHEN 'PR' THEN 'PARROQUIA' END) tipo" +
    " FROM geografia WHERE pk_ubigeo=" + pk_pais + " AND tipo_ubigeo='N'" +
    " UNION" +
    " SELECT pk_ubigeo,nombre_ubigeo,fk_padre," +
    " (CASE tipo_ubigeo" +
    "      WHEN 'N' THEN 'PAÍS'" +
    "      WHEN 'P' THEN 'PROVINCIA'" +
    "      WHEN 'C' THEN 'CIUDAD'" +
    "      WHEN 'PR' THEN 'PARROQUIA' END) tipo FROM geografia WHERE fk_padre=" + pk_pais + " AND tipo_ubigeo='P'" +
    " UNION" +
    " SELECT pk_ubigeo,nombre_ubigeo,fk_padre," +
    " (CASE tipo_ubigeo" +
    "      WHEN 'N' THEN 'PAÍS'" +
    "      WHEN 'P' THEN 'PROVINCIA'" +
    "      WHEN 'C' THEN 'CIUDAD'" +
    "      WHEN 'PR' THEN 'PARROQUIA' END) tipo FROM geografia WHERE tipo_ubigeo='C' AND fk_padre<=284" +
    " UNION" +
    " SELECT pk_ubigeo,nombre_ubigeo,fk_padre," +
    " (CASE tipo_ubigeo" +
    "      WHEN 'N' THEN 'PAÍS'" +
    "      WHEN 'P' THEN 'PROVINCIA'" +
    "      WHEN 'C' THEN 'CIUDAD'" +
    "      WHEN 'PR' THEN 'PARROQUIA' END) tipo FROM geografia WHERE tipo_ubigeo='PR'" +
    " ORDER BY pk_ubigeo ASC, fk_padre ASC";


var consulta_def = {
    consulta: null,
    prefijo: null
}


//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:fk_padre', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var desde = req.query.desde;
    desde = Number(desde);
    var fk_padre = req.params.fk_padre;

    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `SELECT * FROM ${datos_tabla.tabla_target} WHERE fk_padre=${fk_padre} LIMIT ${ rows } OFFSET ${ desde }`;
    } else {
        consulta = `SELECT * FROM ${datos_tabla.tabla_target} WHERE fk_padre=${fk_padre}`;

    }
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

//Rutas
// ==========================================
// Obtener todos los registros TODOS Ordenados
// ========================================== 
app.get('/', mdAuthenticationJWT.verificarToken, (req, res, next) => {

    //SOLO SELECCIONO LA UBICACION GEOGRAFICA DE ECUADOR
    consulta = consultaTodosXPais;


    crud.getAll(datos_tabla.tabla_target, consulta, res);
});


// ==========================================
// Obtener todos los registros busqueda avanzada por parametros
// ========================================== 
app.get('/busqueda/:busqueda/:fk_padre', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var busqueda = req.params.busqueda;
    var fk_padre = req.params.fk_padre;
    //valido que exista el parametro "desde"
    consulta = `SELECT * FROM ${datos_tabla.tabla_target} WHERE fk_padre=${fk_padre} AND nombre_ubigeo LIKE '%${busqueda}%'`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});



// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/ID/:id', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id;
    //consulta si existen un registro del existente
    consulta = `SELECT * FROM ${datos_tabla.tabla_target} WHERE ${datos_tabla.pk_tabla}= ${ id }`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, id, consulta, res);

});

// ==========================================
// Obtener registro por ID parroquia
// ========================================== 
app.get('/parroquia/:id', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id;
    //consulta si existen un registro del existente
    consulta = consulta_parroquia + id;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, id, consulta, res);

});

// ==========================================
// Obtener registro por ID provicnia
// ========================================== 
app.get('/provincia/:id', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id;
    //consulta si existen un registro del existente
    consulta = consulta_provincia + id;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, id, consulta, res);

});

// ==========================================
// Obtener registro por ID ciudad
// ========================================== 
app.get('/ciudad/:id', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id;
    //consulta si existen un registro del existente
    consulta = consulta_ciudad + id;
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