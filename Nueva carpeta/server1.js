var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var promise = require('bluebird');
var http = require('http');
var pgp = require('pg-promise')({ promiseLib: promise });
var app = express();
var fs = require('fs');
var conf = JSON.parse(fs.readFileSync(__dirname + '/srv-config.json'));


const REST_ENDPOINT = '/api/:endpoint';
const HTTP_PORT = conf.puerto;

//PostgreSQL       
var pgConnectionData = {
    host: conf.database.host,
    port: conf.database.port,
    database: conf.database.database,
    user: conf.database.user,
    password: conf.database.password
};
var pgDatabase = pgp(pgConnectionData);

function startHttpServer() {
    var server = false;
    server = http.createServer(app);
    server.listen(HTTP_PORT, function () {
        console.log('Servidor web escuchando en el puerto ' + HTTP_PORT);
    });
    return server;
}

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get(REST_ENDPOINT, (req, res) => {
    console.log("Consultando " + req.params.endpoint + ".get");
    var tabla = "";
    var columnas = "";
    var filtros = "";
    var queryRegistros = "";

    //Consultar si el endpoint existe
    var queryEndpoints = "SELECT * FROM endpoints WHERE endpoint = ${endpoint} AND metodo = 'get'";
    // console.log(queryEndpoints);

    pgDatabase.query(queryEndpoints, req.params).then(function (data) {
            if (data.length == 0) {
                //El endpoint no existe
                return res.badRequest("El endpoint no existe")
            }
            //Guardamos el nombre de la tabla
            tabla = data[0].tabla;
            //Perfecto el endpoint existe
            //Consulto las propiedades del endpoint y luego armo la consulta a la base de datos
            var queryPropiedades = "SELECT * FROM propiedades_endpoints WHERE  endpoint = ${endpoint} AND metodo = 'get'";
            pgDatabase.query(queryPropiedades, req.params).then(function (dataPropiedades) {

                    if (dataPropiedades.length == 0) {
                        //El endpoint no existe
                        return res.badRequest("El endpoint no tiene propiedades")
                    }
                    console.log(dataPropiedades);
                    //Recorremos las propiedades del endpoint y unimos las columnas para las consulta sql
                    //Y tambien los filtros
                    for (var indice in dataPropiedades) {
                        console.log(indice);
                        var columna = dataPropiedades[indice].columna;
                        var propiedad = dataPropiedades[indice].propiedad;
                         columnas = columnas + (columnas === "" ? "" : ",") + columna + " AS " + propiedad;
                        if (req.query[propiedad]) {
                            filtros = filtros + (filtros === "" ? " WHERE " : " AND ") + columna + "='" + req.query[propiedad] + "'";
                        }
                    }
                    //Armamos la consulta final a la base de datos para obtener los registros asociados al enpoint segun la descripcion consultada
                    queryRegistros = "SELECT " + columnas + " FROM " + tabla + filtros;
                    console.log("Query: " + queryRegistros);
                    pgDatabase.query(queryRegistros, req.params)
                        .then(function (dataRegistros) {
                            //Devolvemos los registros
                            return res.json(dataRegistros);
                        })
                        .catch(function (error) { return res.sqlError(error.message) });
                })
                .catch(function (error) { return res.sqlError(error.message) });
        })
        .catch(function (error) { return res.sqlError(error.message) });
})

app.post(REST_ENDPOINT, (req, res) => {

    //Consultar si el endpoint existe
    var queryEndpoints = "SELECT * FROM endpoints WHERE endpoint = ${endpoint} AND metodo = 'post'";
    console.log(req.params);
    pgDatabase.query(queryEndpoints, req.params).then(data => {

        if (data.length == 0) {
            //El endpoint no existe
            return res.badRequest("El endpoint no existe")
        }
        console.log(data);
    }, err => {
        console.error(err);
    })

    queryEndpoints = "insert into endpoints (endpoint, metodo, seguridad, tabla) values (${endpoint} , ${metodo}, ${seguridad}, ${tabla})";
    console.log(queryEndpoints);
    pgDatabase.query(queryEndpoints, req.body).then(data => {
        console.log(data);
        return res.send(data);
    }, err => {
        console.error(err);
    })
})

// res.status(200).send({})


app.put(REST_ENDPOINT, (req, res) => {

    //Consultar si el endpoint existe
    var queryEndpoints = "SELECT * FROM endpoints WHERE endpoint = ${endpoint} AND metodo = 'put'";
    console.log(req.params);
    pgDatabase.query(queryEndpoints, req.params).then(data => {
 
        if (data.length == 0) {
             //El endpoint no existe
             return res.badRequest("El endpoint no existe")
        }
         console.log(data);
     }, err => {
         console.error(err);
    })
    .catch(function (error) { return res.sqlError(error.message) });

    var queryEndpoints = "UPDATE endpoints SET endpoint = ${endpoint}, metodo = ${metodo}, seguridad = ${seguridad}, tabla = ${tabla} WHERE endpoint = 'KON'"

    console.log(queryEndpoints);
    pgDatabase.query(queryEndpoints, req.body).then(data => {
        return res.send(data);
    })
    .catch(function (error) { return res.sqlError(error.message) });
})


app.delete(REST_ENDPOINT, (req, res) => {
    //Consultar si el endpoint existe
    var queryEndpoints = "SELECT * FROM endpoints WHERE endpoint = ${endpoint} AND metodo = 'delete'";
    console.log(req.params);
    pgDatabase.query(queryEndpoints, req.params).then(data => {

        if (data.length == 0) {
            //El endpoint no existe
            return res.badRequest("El endpoint no existe")
        }
        console.log(data);
    }, err => {
        console.error(err);
    })

    queryEndpoints = "DELETE from endpoints WHERE endpoint = ${endpoint}";
    // console.log(queryEndpoints);
    pgDatabase.query(queryEndpoints, req.params).then(data => {
        console.log(data);
        return res.send(data);
    }, err => {
        console.error(err);
    })
})

express.response.badRequest = function (args) {
    this.writeContinue();
    this.statusCode = 400;
    this.send(args);
    this.end();
}

express.response.sqlError = function (args) {
    this.writeContinue();
    this.statusCode = 503;
    this.send(args);
    this.end();
}

httpServer = startHttpServer();

