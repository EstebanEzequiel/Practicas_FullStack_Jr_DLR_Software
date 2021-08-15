var express = require('express');
var router = express.Router({ mergeParams: true });
var path = '/anular/';
var fs = require('fs');
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
const funcAnu = require('./anular-func');
var domains = conf.domains;

router.post(path, async function (req, res) {

    var subdomain = req.params.domain;
    var token = req.query.token;
    var tokenMP = ''
    var token_encontrado = false
    var subD_encontrado = false

    if (((req.query['sucursal'] == undefined) && (req.query['caja'] == undefined)) || ((req.query['sucursal'] == undefined)) || ((req.query['caja'] == undefined))) {
        let error = "Sucursal y/o caja no tienen valores validos o no fueron mandados como parametros."
        console.log(error);
        return res.status(400).json({ error: error });
    }
    if (req.query['external_id'] == undefined) {
        let error = "El external_id no tiene un valor valido o no fue mandado como parametro."
        console.log(error);
        res.status(400).json({ error: error });
    }

    var sucursal = req.query.sucursal;
    var caja = req.query.caja;
    var query = req.query;

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];
    tokenMP = arrayValidado[2];

    console.log("\n\n\n---Consultando anular.post---");

    if (token_encontrado) {

        var token_bruto = tokenMP
        var token_en_array = token_bruto.split("-")

        var n = token_en_array.length
        var user_id = token_en_array[n - 1]

        var external_cobro_id = req.query.external_id

        caja = await funcAnu.buscarCajaDB(sucursal, caja, query).catch(error => {

            return res.status(400).json({ error: error });
        })

        if (caja.length == 0) {
            let error = 'Los valores proporcionados de sucursal y/o caja no existen en la DB.'
            console.log(error);

            return res.status(400).json({ error: error })
        }

        cobro = await funcAnu.buscarCobroDB(external_cobro_id, query).catch(error => {

            return res.status(400).json({ error: error });
        })

        if (cobro.length == 0) {

            let error = 'No existe registro del pago consultado.';
            console.log(error);
            return res.status(400).json({ error: error })
        }

        var post_id = caja[0].external_id

        await funcAnu.orderCanceled(post_id, user_id, tokenMP).catch(error => {

            return res.status(400).json({ error: error });
        })

        response = await funcAnu.updateCobroDB(external_cobro_id).catch(error => {

            return res.status(400).json({ error: error });
        })

        return res.status(200).json({ response: response });

    }
    if (!token_encontrado) {
        let err = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
        console.log(err);
        return res.status(400).json({ err: err })
    }
});

module.exports = router;