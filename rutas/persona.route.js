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
    tabla_target: 'persona',
    pk_tabla: 'pk_person',
    sp_crud_tabla: 'sp_salud_crud_persona'
}

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var desde = req.query.desde;
    desde = Number(desde);
    var fk_padre = req.query.fk_padre || 0;
    fk_padre = Number(fk_padre);
    var consulta;
    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `SELECT * FROM ${ datos_tabla.tabla_target } LIMIT ${ rows } OFFSET ${ desde }`;
    } else {
        consulta = `SELECT * FROM ${ datos_tabla.tabla_target }`;
    }
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

// ==========================================
// Obtener todos los registros busqueda avanzada por parametros
// ========================================== 
app.get('/busqueda', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var busqueda = req.query.busqueda;
    var consulta;
    //valido que exista el parametro "desde"
    consulta = `SELECT * FROM ${ datos_tabla.tabla_target } WHERE numidentificacion_person LIKE '%${busqueda}%'`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

// ==========================================
// Obtener verificacion de numero de documento por tipo
// ========================================== 
app.get('/documento/:tipo_doc/:valor', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var tipo_doc = req.params.tipo_doc;
    var valor = req.params.valor;

    if (tipo_doc === 'cedula') {
        consulta = `SELECT * FROM sp_salud_verificar_cedula('${ valor }')`;
    }
    //LLamo al archivo CRUD OPERACIONES
    crud.getValidar('sp_salud_verificar_cedula', valor, consulta, res);
});


// ==========================================
// Obtener numero de personas con ese numero de cedula
// ========================================== 
app.get('/cantidadPersona/:numdoc', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var numdoc = req.params.numdoc;

    consulta = `select count(*) numpersona from persona p where p.numidentificacion_person='${numdoc}';`;

    //LLamo al archivo CRUD OPERACIONES
    crud.getValidar('persona', numdoc, consulta, res);
});


// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/ID/:id', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id;
    //consulta si existen un registro del existente
    consulta = `SELECT * FROM ${ datos_tabla.tabla_target } WHERE ${datos_tabla.pk_tabla}= ${ id }`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, id, consulta, res);

});

// ==========================================
// Obtener registro por numero de documento
// ========================================== 
app.get('/numdoc/:doc', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var doc = req.params.doc;
    //consulta si existen un registro del existente
    consulta = `SELECT * FROM ${ datos_tabla.tabla_target } WHERE numidentificacion_person= '${ doc }'`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, doc, consulta, res);

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