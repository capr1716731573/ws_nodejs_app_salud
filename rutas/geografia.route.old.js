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

var consulta_def = {
    consulta: null,
    prefijo: null
}

var consulta_paises = "SELECT paises.nombre_ubigeo,paises.pk_ubigeo,paises.fk_padre,paises.tipo_ubigeo FROM geografia paises ";
var consulta_provincias = "SELECT paises.nombre_ubigeo pais,provincias.nombre_ubigeo,provincias.pk_ubigeo,provincias.fk_padre,provincias.tipo_ubigeo FROM geografia provincias INNER JOIN geografia paises on provincias.fk_padre=paises.pk_ubigeo ";
var consulta_ciudades = "SELECT paises.nombre_ubigeo pais,provincias.nombre_ubigeo provincia,ciudades.nombre_ubigeo,ciudades.pk_ubigeo,ciudades.fk_padre,ciudades.tipo_ubigeo FROM geografia ciudades INNER join geografia provincias INNER JOIN geografia paises on provincias.fk_padre=paises.pk_ubigeo on ciudades.fk_padre=provincias.pk_ubigeo ";
var consulta_parroquias = "SELECT paises.nombre_ubigeo pais,provincias.nombre_ubigeo provincia,ciudades.nombre_ubigeo ciudad,parroquias.nombre_ubigeo,parroquias.pk_ubigeo,parroquias.fk_padre,parroquias.tipo_ubigeo FROM geografia parroquias INNER JOIN geografia ciudades INNER join geografia provincias INNER JOIN geografia paises on provincias.fk_padre=paises.pk_ubigeo on ciudades.fk_padre=provincias.pk_ubigeo on parroquias.fk_padre=ciudades.pk_ubigeo ";

var verificarConsulta = function(tipo) {
    if (tipo === 'N') {
        return consulta_def = { consulta: consulta_paises, prefijo: 'paises' };
    } else if (tipo === 'P') {
        return consulta_def = { consulta: consulta_provincias, prefijo: 'provincias' };
    } else if (tipo === 'C') {
        return consulta_def = { consulta: consulta_ciudades, prefijo: 'ciudades' };
    } else if (tipo === 'PR') {
        return consulta_def = { consulta: consulta_parroquias, prefijo: 'parroquias' };
    }
}

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:tipo_ubigeo/:padre', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var desde = req.query.desde;
    desde = Number(desde);
    var tipo_ubigeo = req.params.tipo_ubigeo;
    var padre = req.params.padre;
    var consulta = verificarConsulta(tipo_ubigeo);
    //valido que exista el parametro "desde"
    if (req.query.desde) {
        consulta = `${ consulta.consulta } where ${ consulta.prefijo }.tipo_ubigeo='${tipo_ubigeo}' LIMIT ${ rows } OFFSET ${ desde }`;
    } else {
        consulta = `${ consulta.consulta } where ${ consulta.prefijo }.tipo_ubigeo='${tipo_ubigeo}'`;

    }
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

// ==========================================
// Obtener todos los registros busqueda avanzada por parametros
// ========================================== 
app.get('/busqueda/:busqueda/:tipo_ubigeo', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var busqueda = req.params.busqueda;
    var tipo_ubigeo = req.params.tipo_ubigeo;
    var consulta = verificarConsulta(tipo_ubigeo);
    //valido que exista el parametro "desde"
    consulta = `${ consulta.consulta } WHERE ${ consulta.prefijo }.tipo_ubigeo='${tipo_ubigeo}' AND ${ consulta.prefijo }.nombre_ubigeo LIKE '%${busqueda}%'`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});



// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/ID/:id/:tipo_ubigeo', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var id = req.params.id;
    var tipo_ubigeo = req.params.tipo_ubigeo;
    var consulta = verificarConsulta(tipo_ubigeo);
    //consulta si existen un registro del existente
    consulta = `${ consulta.consulta } WHERE ${ consulta.prefijo }.tipo_ubigeo='${tipo_ubigeo}' AND ${consulta.prefijo}.${datos_tabla.pk_tabla}= ${ id }`;
    console.log(consulta);
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