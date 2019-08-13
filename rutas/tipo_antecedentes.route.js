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
    tabla_target: 'tipo_antecedentes',
    pk_tabla: 'pk_tipant',
    sp_crud_tabla: 'sp_salud_crud_tipo_actecedentes'
}

//Rutas
// ==========================================
// Obtener todos los registros TODOS x PADRE
// ========================================== 
app.get('/:pk_grupant', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_grupant = req.params.pk_grupant;
    var consulta;
    consulta = "select * from tipo_antecedentes ta INNER JOIN grupo_antecedentes a on ta.pk_grupant = a.pk_grupant where ta.pk_grupant=" + pk_grupant + "  order by ta.nombre_tipant";
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});

// ==========================================
// Obtener todos los registros ACTIVOS
// ========================================== 
app.get('/activos/:pk_grupant', mdAuthenticationJWT.verificarToken, (req, res, next) => {
    var pk_grupant = req.params.pk_grupant;
    var consulta;
    consulta = "select * from tipo_antecedentes ta INNER JOIN grupo_antecedentes a on ta.pk_grupant = a.pk_grupant where ta.pk_grupant=" + pk_grupant + " AND ta.activo_tipant=true  order by ta.nombre_tipant";
    crud.getAll(datos_tabla.tabla_target, consulta, res);
});



// ==========================================
// Obtener registro por ID
// ========================================== 
app.get('/:pk_tipant/:pk_grupant', (req, res) => {
    //con req.params.PARAMETRO .. recibe el parametro que envio en la peticion PUT con el campo id (/:id) que es igual al nombre del modelo
    var pk_tipant = req.params.pk_tipant;
    var pk_grupant = req.params.pk_grupant;
    //consulta si existen un registro del existente
    consulta = "select * from tipo_antecedentes ta INNER JOIN grupo_antecedentes a on ta.pk_grupant = a.pk_grupant " +
        "where ta.pk_tipant=" + pk_tipant + " ta.pk_grupant=" + pk_grupant + "  order by ta.nombre_tipant";
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