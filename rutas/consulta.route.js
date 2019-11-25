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
    tabla_target: 'consulta',
    pk_tabla: 'pk_consulta',
    sp_crud_tabla: 'sp_salud_crud_consulta'
}

var consulta_master = "SELECT " +
    "c.pk_consulta, " +
    "c.pk_pac, " +
    "c.pk_user, " +
    "c.fecha_consulta, " +
    "c.motivo_consulta, " +
    "c.enfermedad_consulta, " +
    "c.res_revorgsis_consulta, " +
    "c.evolucion_consulta, " +
    "c.estado_consulta, " +
    "c.audit_creacion, " +
    "c.audit_modificacion, " +
    "c.pk_espec, " +
    "person1.pk_person, " +
    "person1.pk_tipiden, " +
    "person1.numidentificacion_person, " +
    "person1.nombres_person, " +
    "person1.apellidos_person, " +
    "person1.estadocivil_person, " +
    "person1.sexo_person, " +
    "person1.telefono_person, " +
    "person1.celular_person, " +
    "person1.correo_person, " +
    "person1.pk_ubigeo, " +
    "person1.fechanac_person, " +
    "person1.direccion_person, " +
    "person1.pk_nivedu, " +
    "person1.pk_prof, " +
    "person1.ocupacion_person, " +
    "person1.audit_creacion, " +
    "person1.audit_modificacion, " +
    "person2.pk_person as usuario_pk_person, " +
    "person2.pk_tipiden as usuario_pk_tipiden, " +
    "person2.numidentificacion_person as usuario_numidentificacion_person, " +
    "person2.nombres_person as usuario_nombres_person, " +
    "person2.apellidos_person as usuario_apellidos_person, " +
    "person2.estadocivil_person as usuario_estadocivil_person, " +
    "person2.sexo_person as usuario_sexo_person, " +
    "person2.telefono_person as usuario_telefono_person, " +
    "person2.celular_person as usuario_celular_person, " +
    "person2.correo_person as usuario_correo_person, " +
    "person2.pk_ubigeo as usuario_pk_ubigeo, " +
    "person2.fechanac_person as usuario_fechanac_person, " +
    "person2.direccion_person as usuario_direccion_person, " +
    "person2.pk_nivedu as usuario_pk_nivedu, " +
    "person2.pk_prof as usuario_pk_prof, " +
    "person2.ocupacion_person as usuario_ocupacion_person, " +
    "person2.audit_creacion as usuario_audit_creacion, " +
    "person2.audit_modificacion as usuario_audit_modificacion, " +
    "e.pk_espec, " +
    "e.nombre_espec " +
    "FROM consulta c " +
    "INNER JOIN paciente pac " +
    "INNER JOIN persona person1 on pac.pk_person = person1.pk_person " +
    "on c.pk_pac = pac.pk_pac " +
    "INNER JOIN usuario u " +
    "INNER JOIN persona person2 on u.pk_person = person2.pk_person " +
    "on c.pk_user = u.pk_user " +
    "LEFT JOIN especialidad e on c.pk_espec = e.pk_espec ";

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
        consulta = `${ consulta_master } LIMIT ${ rows } OFFSET ${ desde }`;
    } else {
        consulta = `${ consulta_master }`;
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
    consulta = `${ consulta_master } WHERE person1.numidentificacion_person LIKE '%${busqueda}%'`;
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
    consulta = `${ consulta_master } WHERE ${datos_tabla.pk_tabla}= ${ id }`;
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