var express = require('express');
var app = express();
var bcryptjs = require('bcryptjs');
var rows = require('../config/config').ROWS_POR_PAG;
var mdAuthenticationJWT = require('../middlewares/authentication');
//variable de conexion a postgres
const pool = require('../config/db');

//datos de funcion crud general
var crud = require('../funciones/crud_operaciones');
//DATOS DE LA TABLA
var datos_tabla = {
    tabla_target: 'usuario',
    pk_tabla: 'pk_user',
    sp_crud_tabla: 'sp_salud_crud_usuario'
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
        consulta = `SELECT * FROM ${ datos_tabla.tabla_target } usu INNER JOIN persona p on usu.pk_person = p.pk_person ORDER BY p.apellidos_person ASC, p.nombres_person ASC LIMIT ${ rows } OFFSET ${ desde }`;
    } else {
        consulta = `SELECT * FROM ${ datos_tabla.tabla_target } usu INNER JOIN persona p on usu.pk_person = p.pk_person ORDER BY p.apellidos_person ASC, p.nombres_person ASC`;
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
    consulta = `SELECT * FROM ${ datos_tabla.tabla_target } usu INNER JOIN persona p on usu.pk_person = p.pk_person 
    WHERE usu.usuario_user LIKE '%${busqueda}%' OR p.apellidos_person LIKE '%${busqueda}%' OR 
       p.nombres_person LIKE '%${busqueda}%' OR p.numidentificacion_person LIKE '%${busqueda}%'`;
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
    consulta = `SELECT * FROM ${ datos_tabla.tabla_target } usu INNER JOIN persona p on usu.pk_person = p.pk_person WHERE ${datos_tabla.pk_tabla}= ${ id }`;
    //LLamo al archivo CRUD OPERACIONES
    crud.getID(datos_tabla.tabla_target, id, consulta, res);

});

// ==========================================
// Ejecutar Crud acorde a parametro 
// ========================================== 
app.post('/', mdAuthenticationJWT.verificarToken, (req, res) => {

    //Recibo los datos en el body y con el body parser me lo transforma a JSON
    var body = req.body;
    //encripto password
    if (body.opcion === 'I') {
        body.json.password_user = bcryptjs.hashSync(body.json.password_user, 10);
        console.log(JSON.stringify(body));
    } else {
        if (body.json.password_user != body.json.password2) {
            body.json.password_user = bcryptjs.hashSync(body.json.password_user, 10);
        }
    }

    consulta = `SELECT * FROM ${datos_tabla.sp_crud_tabla} ($1,$2)`;
    crud.crudBasico(datos_tabla.tabla_target, consulta, body, res);

});


// ==========================================
// Obtener numero de personas atadas a ese usuario por los general es una
// ========================================== 
app.get('/persona/:numdoc', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var numdoc = req.params.numdoc;

    consulta = `select count(*) numpersona from persona p inner join usuario u on p.pk_person = u.pk_person
      where p.numidentificacion_person='${numdoc}';`;

    //LLamo al archivo CRUD OPERACIONES
    crud.getValidar('usuario', numdoc, consulta, res);
});



module.exports = app;