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
                    a.pk_espemed,
                    a.nombres_age,
                    a.apellidos_age,
                    a.fecha_age,
                    to_char(a.hora_age, 'HH24:MI') as hora_age,
                    a.medio_age,
                    a.telefono_age,
                    a.celular_age,
                    a.estado_age,
                    a.audit_creacion,
                    a.audit_modificacion,
                    (select * from sp_salud_getgeografia(a.pk_ubigeo)) as geografia_agenda,
                    em.pk_user,
                    em.pk_espec,
                    p.numidentificacion_person,
                    p.nombres_person,
                    p.apellidos_person,
                    p2.nombre_prof,
                    p2.siglas_prof,
                    e.nombre_espec
                    from agenda a INNER JOIN especialidad_medico em
                            inner join especialidad e
                            on em.pk_espec = e.pk_espec
                            inner join usuario u
                            inner join persona p
                            inner join profesion p2
                            on p.pk_prof = p2.pk_prof
                            on u.pk_person = p.pk_person
                            on em.pk_user = u.pk_user
                            on a.pk_espemed = em.pk_espemed`

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/', mdAuthenticationJWT.verificarToken, (req, res, next) => {

    var fecha_inicio = `'${req.query.fecha_inicio}'::date`;
    var fecha_fin = `'${req.query.fecha_fin}'::date`;

    if (fecha_inicio === null) fecha_inicio = "(now()::date-'1 month'::interval)::date";
    if (fecha_fin === null) fecha_fin = "(now()::date+'1 month'::interval)::date";

    var desde = req.query.desde;
    desde = Number(desde);
    var consulta;
    //valido que exista el parametro "desde"
    consulta = `${consulta_base} where a.fecha_age >=${fecha_inicio} AND a.fecha_age <=${fecha_fin} order by a.fecha_age DESC, a.hora_age ASC, a.nombres_age ASC, a.apellidos_age ASC`;


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