const express = require('express');
var http = require('http');
var app = express();
var fs = require("fs");
var request = require('request');
var conf = JSON.parse(fs.readFileSync("./srv-config.json"));
global.conf = conf;
var pgDatabase = require("./DB");
const { config } = require('bluebird');
const REST_mercadopago = "/mercadopago/";
const HTTP_PORT = conf.puerto;
const pathWithParameter = require('./domainRouter')

let port = process.env.PORT || HTTP_PORT;

app.set('port', process.env.PORT || HTTP_PORT);

app.use(REST_mercadopago, pathWithParameter)

function startHttpServer() {
    var server = false;
    server = http.createServer(app);
    server.listen(port, function () {
        console.log('Servidor web esta escuchando en el puerto ' + port);
    });
    return server;
};


app.get(REST_mercadopago, (req, res) => {

    console.log('Consultando notifications.get');

    if (req.query.external_id == undefined) {

        var queryInitial = "SELECT * FROM notifications WHERE id = ${id} AND topic = ${topic}";

        pgDatabase.query(queryInitial, req.query).then(function (data) {
            if (data.length == 0) {
                return res.badRequest("La notificacion no existe")
            }

            var queryGET = "SELECT * FROM notifications WHERE id = ${id} AND topic = ${topic}"

            console.log("Query: " + queryGET);
            console.log("----------------------------------------------");

            pgDatabase.query(queryGET, req.query).then(function (data) {
                return res.status(200).json(data);
            })
                .catch(function (error) { return res.sqlError(error.message) });

        })
            .catch(function (error) { return res.sqlError(error.message) });

    } else {

        var queryInitial = "SELECT * FROM notifications WHERE external_id = ${external_id} AND topic = ${topic}";

        pgDatabase.query(queryInitial, req.query).then(function (data) {
            if (data.length == 0) {
                return res.badRequest("La notificacion no existe")
            }

            var queryGET = "SELECT * FROM notifications WHERE external_id = ${external_id} AND topic = ${topic}"

            console.log("Query: " + queryGET);
            console.log("----------------------------------------------");

            pgDatabase.query(queryGET, req.query).then(function (data) {
                return res.status(200).json(data);
            })
                .catch(function (error) { return res.sqlError(error.message) });

        })
            .catch(function (error) { return res.sqlError(error.message) });
    }


});


app.post(REST_mercadopago, (req, res) => {

    console.log("Consultando notifications.post");

    var valores_id = [];
    var valores_topic = []
    var queryInitial = "SELECT * FROM notifications WHERE id = ${id} AND topic = ${topic}";

    pgDatabase.query(queryInitial, req.query).then(function (dataNotifications) {

        if (dataNotifications.length == 0) {
            let index = 0;
            let campos = [req.query];

            for (let k of campos) {

                if (k.id == undefined && k.topic == undefined) {
                    console.log('El valor de la notificacion es undefined');
                }
                else {
                    valores_id.push("'" + k.id + "'"),
                        valores_topic.push("'" + k.topic + "'")
                }

                index++;
            }

            var options = {
                'method': 'GET',
                'url': 'https://api.mercadopago.com/merchant_orders/search?external_reference=888888',
                'headers': {
                    'Authorization': 'Bearer APP_USR-6848942778215476-031814-e56e1d303b386321092244269f1eddb3-730655432'
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
            });


            queryPOST = "INSERT INTO notifications (id, topic, time) VALUES (" + valores_id + ", " + valores_topic + ", CURRENT_TIMESTAMP)";
            console.log("Query: " + queryPOST);
            console.log("---------------------------------------------------------------------------");

            pgDatabase.query(queryPOST, req.params).then(data => {
                return res.status(200).json(200);
            })
                .catch(function (error) { return res.sqlError(error.message) });
        }
        else {
            return res.badRequest("La notificacion ya existe")
        }
    })
        .catch(function (error) { return res.sqlError(error.message) });
});



express.response.badRequest = function (args) {
    this.writeContinue();
    this.statusCode = 400;
    this.send(args);
    this.end();
};

express.response.sqlError = function (args) {
    this.writeContinue();
    this.statusCode = 503;
    this.send(args);
    this.end();
};

httpServer = startHttpServer();