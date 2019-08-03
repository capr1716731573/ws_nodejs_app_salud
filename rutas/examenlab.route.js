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
    tabla_target: 'examen',
    pk_tabla: 'pk_exa',
    sp_crud_tabla: 'sp_salud_crud_tipo_examen'
}

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:pk_auxdiag', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_auxdiag = req.params.pk_auxdiag;
    var consulta;
    consulta = "SELECT * from examen e INNER JOIN auxiliar_diagnostico a on e.pk_auxdiag = a.pk_auxdiag  where a.pk_auxdiag=" + pk_auxdiag + "  order by e.nombre_exa";
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});



// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:pk_exa/:pk_auxdiag', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var pk_exa = req.params.pk_exa;
    var pk_auxdiag = req.params.pk_auxdiag;
    //consulta si existen un registro del existente
    consulta = "SELECT * from examen e INNER JOIN auxiliar_diagnostico a on e.pk_auxdiag = a.pk_auxdiag " +
        "where a.pk_auxdiag=" + pk_auxdiag + " e.pk_exa=" + pk_exa + "  order by e.nombre_exa";
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