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
    tabla_target: 'especialidad_medico',
    pk_tabla: 'pk_espec',
    sp_crud_tabla: 'sp_salud_crud_especialidad_usuario'
}

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:pk_user', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_user = req.params.pk_user;
    var consulta;
    consulta = "select em.pk_user, em.pk_espec, em.audit_creacion, em.audit_modificacion, e.nombre_espec, coalesce(em.codmsp_espcmed,'SIN CÓDIGO') AS codmsp_espcmed, coalesce(em.senecyt_espcmed,'SIN REGISTRO') AS senecyt_espcmed " +
        "from especialidad_medico em INNER JOIN especialidad e on em.pk_espec = e.pk_espec " +
        "WHERE em.pk_user=" + pk_user + "  ORDER BY e.nombre_espec";
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

//Rutas
// ==========================================
// Obtener todos los Medicos Visibles
// ========================================== 
app.get('/', mdAuthenticationJWT.verificarToken, (req, res, next) => {

    var consulta = "select " +
        " em.pk_espemed, " +
        " em.pk_user, " +
        " persona.nombres_person, " +
        " persona.apellidos_person, " +
        " persona.numidentificacion_person, " +
        " profesion.nombre_prof, " +
        " profesion.siglas_prof, " +
        " concat(profesion.siglas_prof,' ',persona.nombres_person,' ',persona.apellidos_person) AS nombres_completos, " +
        " em.pk_espec, " +
        " em.audit_creacion, " +
        " em.audit_modificacion, " +
        " e.nombre_espec, " +
        " coalesce(em.codmsp_espcmed,'SIN CÓDIGO') AS codmsp_espcmed, " +
        " coalesce(em.senecyt_espcmed,'SIN REGISTRO') AS senecyt_espcmed " +
        " from especialidad_medico em " +
        " INNER JOIN usuario " +
        " INNER JOIN persona " +
        " INNER JOIN profesion " +
        " on persona.pk_prof = profesion.pk_prof " +
        " on usuario.pk_person = persona.pk_person " +
        " on em.pk_user = usuario.pk_user " +
        " INNER JOIN especialidad e on em.pk_espec = e.pk_espec " +
        " where usuario.visible_user=true "
    " ORDER BY e.nombre_espec";
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});



// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:pk_user/:pk_especialidad', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var pk_user = req.params.pk_user;
    var pk_especialidad = req.params.pk_especialidad;
    //consulta si existen un registro del existente
    consulta = "select em.pk_espemed,em.pk_user, em.pk_espec, em.audit_creacion, em.audit_modificacion, e.nombre_espec, coalesce(em.codmsp_espcmed,'SIN CÓDIGO') AS codmsp_espcmed, coalesce(em.senecyt_espcmed,'SIN REGISTRO') AS senecyt_espcmed " +
        "from especialidad_medico em INNER JOIN especialidad e on em.pk_espec = e.pk_espec " +
        "WHERE em.pk_user=" + pk_user + " AND em.pk_espec=" + pk_especialidad + "  ORDER BY e.nombre_espec";
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