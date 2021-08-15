var express = require('express');
var router = express.Router({ mergeParams: true });
var pgDatabase = require('../../DB');
const path = '/devolucion/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
const funcDev = require('./devolucion-func');


const domains = conf.domains;

router.post(path, async (req, res) => {

    var subdomain = req.params.domain;
    var token = req.query.token;
    var tokenMP = '';
    var token_encontrado = false;
    var subD_encontrado = false;
    var sucursalOk = false;
    var cajaOk = false;
    var query = req.query;

    if (((req.query['sucursal'] == undefined) && (req.query['caja'] == undefined)) || ((req.query['sucursal'] == undefined)) || ((req.query['caja'] == undefined))) {
        let error = "Sucursal y/o caja no tienen valores validos o no fueron mandados como parametros."
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error });
    }
    if (req.query['external_id'] == undefined) {
        let error = "El external_id no tiene un valor valido o no fue mandado como parametro."
        console.log(error);
        func.appendLogs(error);
        res.status(400).json({ error: error });
    }

    var sucursal = parseInt(req.query.sucursal);
    var caja = parseInt(req.query.caja);
    var id_cobro = (req.query.external_id);
    var pv = req.query.pv;
    var tipo = req.query.tipo;
    var numero = req.query.numero;
    var monto = parseFloat(req.query.monto);
    var estado = '';

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];
    tokenMP = arrayValidado[2];

    console.log("\n\n\n---Consultando devolucion.post---");
    func.appendLogs("\n\n\n---Consultando devolucion.post---");

    let columnSucursal = await funcDev.sucursalOk(sucursal, subdomain, query).catch(error => {


        return res.status(400).json({ error: error });
    })

    if (columnSucursal[0].sucursal === '1') {

        sucursalOk = true

        let columnCaja = await funcDev.cajaOk(sucursal, caja, subdomain, query).catch(error => {


            return res.status(400).json({ error: error });
        })

        if (columnCaja[0].caja === '1') {

            cajaOk = true

        }

        if (!cajaOk) {
            let error = 'La caja no esta dada de alta.'
            console.log(error);
            func.appendLogs(error);
            return res.status(400).json({ error: error })
        }
    }

    if (!sucursalOk) {
        let error = 'La sucursal no esta dada de alta.'
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error })
    }



    if (token_encontrado && sucursalOk && cajaOk) {

        let dataDev = await funcDev.selectPayment(query, subdomain, pv, tipo, numero, id_cobro).catch(error => {

            return res.status(400).json({ error: error })
        })

        if (dataDev.length === 0) {
            let error = 'El cobro no esta registrado como pagado en Mercado Pago.'
            func.appendLogs(dataDev);
            func.appendLogs(error);
            return res.status(400).json({ error: error })

        }

        let pagoAprobado = null;

        for (i = 0; i < dataDev.length; i++) {

            if (dataDev[i].estado == 'approved') {
                pagoAprobado = dataDev[i]
            }

        }

        if (pagoAprobado != null) {

            let montoPayment = parseFloat(pagoAprobado.monto);
            console.log(req.query);
            console.log(montoPayment);
            console.log(monto);

            if (montoPayment < monto) {
                let error = "El monto proporcionado es mayor al pago realizado."
                console.log(error);
                func.appendLogs(error);
                return res.status(400).json({ error: error })
            }

            id_cobro = parseInt(pagoAprobado.external_id)
            let id_payments = parseInt(pagoAprobado.id_payments);
            // console.log(id_payments);
            // console.log(id_cobro);


            //https://api.mercadopago.com/v1/advanced_payments/' + id_payments + '/refunds
            //https://api.mercadopago.com/v1/payments/' + id_payments + '/refunds


            let dataDevMP = await funcDev.devMP(id_payments, tokenMP, monto, estado).catch(error => {


                return res.status(400).json({ error: error });
            });

            if (dataDevMP['error']) {
                let error = "Error al registrar la devolucion en Mercado Pago."
                return res.status(400).json({ error: error })
            }

            let id_mp = dataDevMP[0];
            let body_dev = dataDevMP[1];
            estado = dataDevMP[2];

            let id_dev = await funcDev.insertDevolucion(sucursal, subdomain, caja, id_cobro, id_payments, body_dev, monto, id_mp, estado, query).catch(error => {

                return res.status(400).json({ error: error });
            })

            await funcDev.updateCobrosDev(id_dev, id_cobro, body_dev, query).catch(error => {

                return res.status(400).json({ error: error });
            })

            return res.status(200).json({ external_id_dev: id_dev, body_dev: body_dev })

        } else {
            let error = 'No se encontro un pago aprobado o ya fue devuelto.'
            console.log(error);
            func.appendLogs("Pago Aprobado: " + pagoAprobado);
            func.appendLogs(error);
            return res.status(400).json({ error: error })
        }
    }


    if (!token_encontrado) {
        let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error })
    }
    if (!sucursalOk) {
        let error = 'La sucursal no esta dada de alta.'
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error })
    }

});


router.get(path, async (req, res) => {

    // arrayValidado1 = logger.dirname();
    // console.log(arrayValidado1);

    var subdomain = req.params.domain;
    var token = req.query.token;
    var token_encontrado = false;
    var subD_encontrado = false;
    var external_id = req.query.external_id;
    var query = req.query;

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];

    console.log('\n\n\n---Consultando devolucion.get---');
    func.appendLogs('\n\n\n---Consultando devolucion.get---');

    if (token_encontrado) {

        let dataDev = await funcDev.selectDev(subdomain, external_id, query).catch(error => {
            return res.status(400).json({ error: error });
        })

        if (dataDev.length == 0) {

            let error = "La devolucion no existe."
            return res.status(400).json({ error: error })

        }
        else {

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
