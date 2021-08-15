var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var http = require('http');
var app = express();
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync(__dirname + "/srv-config.json"));
var ezequiel = require('./ezequiel/ezequiel');
var getrouter = require('./get/getrouter');
var mateo = require('./mateo/post');
var mauricio = require('./mauricio/delete');
const REST_ENDPOINT = "/api/";
const HTTP_PORT = conf.puerto;


let port =process.env.PORT || HTTP_PORT;
app.set('port', process.env.PORT || HTTP_PORT);
function startHttpServer() {
    var server = false;
    server = http.createServer(app);
    server.listen(port, function () {
        console.log('Servidor web escuchando en el puerto ' + port);
    });
    return server;
}
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(REST_ENDPOINT, ezequiel);
app.use(REST_ENDPOINT, getrouter);
app.use(REST_ENDPOINT,mateo);
app.use(REST_ENDPOINT,mauricio);


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

