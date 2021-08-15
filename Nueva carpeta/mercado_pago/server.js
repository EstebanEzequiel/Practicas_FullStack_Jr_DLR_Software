const express = require('express');
var http = require('http');
var app = express();
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync(__dirname + "/srv-config.json"));
const REST_mercadopago = "/mercadopago/";
const HTTP_PORT = conf.puerto;

let port = process.env.PORT || HTTP_PORT;

app.set('port', process.env.PORT || HTTP_PORT);

function startHttpServer() {
    var server = false;
    server = http.createServer(app);
    server.listen(port, function () {
        console.log('Servidor web esta escuchando en el puerto ' + port);
    });
    return server;
}

app.get(REST_mercadopago, (req,res)=>{
    res.send('<h1> Hello Mercado pago </h1>');
});

app.post(REST_mercadopago,(req,res) => {
    //te posteo
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