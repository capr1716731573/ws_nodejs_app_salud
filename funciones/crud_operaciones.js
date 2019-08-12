//variable de conexion a postgres
const pool = require('../config/db');
var funcionesCrud = {};

//DATOS DE LA TABLA

// ==========================================
// Obtener varios registros
// ========================================== 
funcionesCrud.getAll = function(tabla_target, consulta, res) {

    total_registros = 0;
    consulta_total_rows = `SELECT count(*) FROM ${tabla_target}`;
    pool.query(consulta_total_rows, (err, response) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: `Error cargando cantidad ${ tabla_target }`,
                errors: err
            });
        }

        total_registros = Number(response.rows[0].count);

        pool.query(consulta, (err, response) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: `Error cargando ${ tabla_target }`,
                    errors: err
                });
            }


            res.status(200).json({
                status: 'ok',
                data: response.rows, // < ----- si no da error retorno el usuarios de la linea #17
                total_registros: total_registros
            });

        })
    })

}

// ==========================================
// Obtener un solo registro
// ========================================== 
funcionesCrud.getID = function(tabla_target, id, consulta, res) {

    //aplico este metodo de moongose para saber si el usuario existe
    pool.query(consulta, (err, response) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: `Error al buscar ${ tabla_target }`,
                errors: err
            });
        }

        if (response.rowCount <= 0) {
            return res.status(400).json({
                status: 'error',
                message: `El ${ tabla_target } con el id ` + id + ' no existe',
                errors: { message: `No existe un ${ tabla_target } con es ID` }
            });
        }
        res.status(200).json({
            status: 'ok',
            data: response.rows[0]
        });

    })
};

// ==========================================
// Validar datos 
// ========================================== 
funcionesCrud.getValidar = function(metodo, valor, consulta, res) {

    //aplico este metodo de moongose para saber si el usuario existe
    pool.query(consulta, (err, response) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: `Error al buscar ${ metodo }`,
                errors: err
            });
        }

        if (response.rowCount <= 0) {
            return res.status(400).json({
                status: 'error',
                message: `El metodo ${ metodo } con el valor ` + valor + ' no existe',
                errors: { message: `No existe metodo ${ metodo }, con el valor ${ valor }` }
            });
        }
        res.status(200).json({
            status: 'ok',
            data: response.rows[0]
        });

    })
};

// ==========================================
// Operaciones CRUD tablas basicas
// ========================================== 
funcionesCrud.crudBasico = function(tabla_target, consulta, parametros, res) {
    pool.query(consulta, [parametros.opcion, parametros.json], (err, response) => {
        if (err) {
            return res.status(400).json({
                status: 'error',
                message: `Error al "${parametros.opcion}" en la tabla ${tabla_target}`,
                errors: err
            });
        }

        res.status(201).json({
            status: 'ok',
            //SE UTILIZA EL json_build_object XQ ESTA OPCION VIENE DE POSTGRES 
            //LA TRA PARTE response.rows[0] ES DE pg de express en postgres y nodejs
            respuesta: response.rows[0].mensaje
        });
    });
}

module.exports = funcionesCrud;