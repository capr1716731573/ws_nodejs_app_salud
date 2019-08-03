var express = require('express');
var bodyParser = require('body-parser');

var tipo_identificacion_route = require('./rutas/tipo_identificacion.route');
var geografia_route = require('./rutas/geografia.route');
var profesion_route = require('./rutas/profesion.route');
var nivel_educacion_route = require('./rutas/nivel_educacion.route');
var auxiliar_diagnostico_route = require('./rutas/auxiliar_diagnostico.route');
var exameneslab_route = require('./rutas/examenlab.route');
var captacion_vacunas_route = require('./rutas/captacion_vacunas.route');
var tipo_vacunas_route = require('./rutas/tipo_vacunas.route');
var grupo_antecedentes_route = require('./rutas/grupo_antecedentes.route');
var tipo_antecedentes_route = require('./rutas/tipo_antecedentes.route');
var grupo_sanguineo_route = require('./rutas/grupo_sanguineo.route');
var etnia_route = require('./rutas/etnia.route');
var usuario_route = require('./rutas/usuario.route');
var persona_route = require('./rutas/persona.route');
var items_menu_route = require('./rutas/items_menu.route');
var menu_perfil_route = require('./rutas/menu_perfil.route');
var tipo_seguro_route = require('./rutas/tipo_seguro.route');
var tipo_discapacidad_route = require('./rutas/tipo_discapacidad.route');
var empresa_route = require('./rutas/empresa.route');
var empresa_user_route = require('./rutas/empresa_user.route');
var cie10_route = require('./rutas/cie10.route');
var perfil_route = require('./rutas/perfil.route');
var perfil_usuario_route = require('./rutas/perfil_usuario.route');
var especialidad_route = require('./rutas/especialidad.route');
var especialidad_user_route = require('./rutas/especialidad_user.route');
var tipo_organos_sistemas_route = require('./rutas/tipo_organos_sistemas.route');
var tipo_examen_route = require('./rutas/tipo_examen.route');
var region_tipo_examen_route = require('./rutas/regiones_tipexamen.route');
var login_route = require('./rutas/login.route');

//Inicializar variables 
var app = express();

//Habilitar CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,token");
    res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS", );
    next();
});

//Configuracion Body-Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/tipo_identificacion', tipo_identificacion_route);
app.use('/geografia', geografia_route);
app.use('/profesion', profesion_route);
app.use('/nivel_educacion', nivel_educacion_route);
app.use('/auxiliar_diagnostico', auxiliar_diagnostico_route);
app.use('/examenes_lab', exameneslab_route);
app.use('/captacion_vacunas', captacion_vacunas_route);
app.use('/tipo_vacunas', tipo_vacunas_route);
app.use('/grupo_antecedentes', grupo_antecedentes_route);
app.use('/tipo_antecedentes', tipo_antecedentes_route);
app.use('/grupo_sanguineo', grupo_sanguineo_route);
app.use('/etnia', etnia_route);
app.use('/usuarios', usuario_route);
app.use('/persona', persona_route);
app.use('/menu', items_menu_route);
app.use('/menu_perfil', menu_perfil_route);
app.use('/tipo_seguro', tipo_seguro_route);
app.use('/tipo_discapacidad', tipo_discapacidad_route);
app.use('/empresa', empresa_route);
app.use('/empresa_user', empresa_user_route);
app.use('/cie10', cie10_route);
app.use('/perfil', perfil_route);
app.use('/perfil_usuario', perfil_usuario_route);
app.use('/especialidad', especialidad_route);
app.use('/especialidad_user', especialidad_user_route);
app.use('/tipo_organos_sistemas', tipo_organos_sistemas_route);
app.use('/tipo_examen', tipo_examen_route);
app.use('/region_tipo_examen', region_tipo_examen_route);
app.use('/login', login_route);

//Configuracion 2 ->Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});