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
    tabla_target: 'empresa_usuario',
    pk_tabla: 'pk_user',
    sp_crud_tabla: 'sp_salud_crud_empresa_usuario'
}

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:pk_user', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_user = req.params.pk_user;
    var consulta;
    consulta = "SELECT * from empresa_usuario INNER JOIN empresa e on empresa_usuario.pk_empre = e.pk_empre where pk_user=" + pk_user + "  ORDER BY e.nombre_empre";
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});



// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:pk_user/:pk_empre', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var pk_user = req.params.pk_user;
    var pk_empre = req.params.pk_empre;
    //consulta si existen un registro del existente
    consulta = "SELECT * from empresa_usuario INNER JOIN empresa e on empresa_usuario.pk_empre = e.pk_empre where pk_user=" + pk_user + " AND pk_empre=" + pk_empre + "  ORDER BY e.nombre_empre";
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