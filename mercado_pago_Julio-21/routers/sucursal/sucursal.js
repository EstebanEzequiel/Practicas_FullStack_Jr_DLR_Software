var express = require('express');
var router = express.Router({ mergeParams: true });
var path = '/sucursal/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var pgDatabase = require('../../DB');
var func = require('../../server-functions');
var funcSuc = require('./sucursal-func');
var domains = conf.domains;

router.post(path, async function (req, res) {

    var subdomain = req.params.domain;
    var sucursal = parseInt(req.query.sucursal)
    var token = req.query.token;
    var arrayValidado = [];
    var sucursalNoExist = true;
    var query = req.query;

    var token_encontrado = false
    var subD_encontrado = false

    arrayValidado = func.dominioToken(domains, token, subdomain)
    subD_encontrado = arrayValidado[0]
    token_encontrado = arrayValidado[1]

    console.log("\n\n\n---Consultando sucursal.post---");
    func.appendLogs("\n\n\n---Consultando sucursal.post---");

    sucursal = await funcSuc.validarSucursalDB(sucursal, subdomain, query).catch(error => {

        return res.status(400).json({ error: error });

    })

    if (sucursal[0].sucursal === '1' && token_encontrado) {

        sucursalNoExist = false

        let error = 'La sucursal ya existe en la base de datos.'
        console.log('\n' + error);
        func.appendLogs(error);

        return res.status(400).json({ error: error })
    }

    if (!token_encontrado) {

        let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio es incorrecto.';
        console.log('\n' + error);
        func.appendLogs(error);

        return res.status(400).json({ error: error })
    }


    if (token_encontrado && sucursalNoExist) {

        var sucursal = req.query.sucursal
        var nombre = req.query.nombre
        var ciudad = req.query.ciudad
        var provincia = req.query.provincia
        var latitud = req.query.latitud
        var longitud = req.query.longitud
        var calle = req.query.calle
        var numero = req.query.numero

        respuesta = await funcSuc.insertSucursalDB(sucursal, nombre, subdomain, ciudad, provincia, latitud, longitud, calle, numero).catch(error => {

            return res.status(400).json({ error: error });

        })

        return res.status(200).json({ response: respuesta })

    }

})

module.exports = router;
