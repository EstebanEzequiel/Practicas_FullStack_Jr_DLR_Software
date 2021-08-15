var express = require('express');
var router = express.Router({ mergeParams: true });
var request = require('request');
var pgDatabase = require('../../DB');
const path = '/ultimadevolucion/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
const funcDev = require('./devolucion-func');

const domains = conf.domains;


router.get(path, async (req, res) => {

    // arrayValidado1 = logger.dirname();
    // console.log(arrayValidado1);

    var subdomain = req.params.domain;
    var token = req.query.token;
    var token_encontrado = false;
    var subD_encontrado = false;
    var query = req.query;

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];

    console.log('\n\n\n---Consultando devolucion.get---');
    func.appendLogs('\n\n\n---Consultando devolucion.get---');

    if (token_encontrado) {

        let dataDev = await funcDev.selectUltimaDev(query, subdomain).catch(error => {
            return res.status(400).json({ error: error })
        })

        if (dataDev.length == 0) {

            let error = "La devolucion no existe."
            return res.status(400).json({ error: error })

        }
        else {

            console.log("\nResponse: ", dataDev);

            func.appendLogs(dataDev);
            return res.status(200).send(dataDev);
        }

    }
    if (!token_encontrado) {
        let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error })
    }
});

module.exports = router;
