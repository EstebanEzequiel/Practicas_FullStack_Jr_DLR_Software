var express = require('express');
var router = express.Router({ mergeParams: true });
const path = '/cobrar/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
const funcCob = require('./cobrar-func');
const domains = conf.domains;

router.post(path, async (req, res) => {

    var subdomain = req.params.domain;
    var token = req.query.token;
    var sucursalOk = false
    var cajaOk = false
    var tokenMP = '';
    var token_encontrado = false;
    var subD_encontrado = false;
    var query = req.query;

    if (((req.query['sucursal'] == undefined) && (req.query['caja'] == undefined)) || ((req.query['sucursal'] == undefined)) || ((req.query['caja'] == undefined))) {
        let error = "Sucursal y/o caja no tienen valores validos o no fueron mandados como parametros."
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error });
    }
    if (req.query['monto'] == undefined) {
        let error = "El monto no tiene un valor valido o no fue mandado como parametro."
        console.log(error);
        func.appendLogs(error);
        res.status(400).json({ error: error });
    }

    var sucursal = parseInt(req.query.sucursal);
    var caja = parseInt(req.query.caja);
    var monto = parseFloat(req.query.monto);
    var external_id = '';
    var pv = req.query.pv;
    var tipo = req.query.tipo;
    var numero = req.query.numero;

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];
    tokenMP = arrayValidado[2];

    console.log("\n\n\n---Consultando cobrar.post---");
    func.appendLogs("\n\n\n---Consultando cobrar.post---");

    let columnSucursal = await funcCob.sucursalOk(sucursal, subdomain, query).catch(error => {

        return res.status(400).json({ error: error });
    })

    if (columnSucursal[0].sucursal === '1') {

        sucursalOk = true

        let columnCaja = await funcCob.cajaOk(sucursal, caja, subdomain, query).catch(error => {

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

        var token_bruto = tokenMP
        var token_en_array = token_bruto.split("-")

        var n = token_en_array.length
        var user_id = token_en_array[n - 1]


        await funcCob.selectCobro(query).catch(error => {

            return res.status(400).json({ error: error });
        })

        external_id = await funcCob.insertCobro(sucursal, subdomain, caja, pv, tipo, numero, monto, query).catch(error => {

            return res.status(400).json({ error: error });
        })


        let id_sucursal = await funcCob.buscarId_Suc(sucursal, query).catch(error => {

            return res.status(400).json({ error: error });
        })


        let id_caja = await funcCob.buscarId_Caja(caja, sucursal, subdomain, query).catch(error => {

            return res.status(400).json({ error: error });
        })


        await funcCob.putOrder(user_id, id_sucursal, id_caja, tokenMP, external_id, subdomain, monto).catch(error => {

            return res.status(400).json({ error: error });
        })

        return res.status(200).json({ external_id: external_id })

    }

    if (!token_encontrado) {
        let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error })
    }

});


router.get(path, async (req, res) => {


    var subdomain = req.params.domain;
    var token = req.query.token;
    var token_encontrado = false;
    var subD_encontrado = false;
    var sucursalOk = false;
    var cajaOk = false
    var query = req.query;
    var params = req.params;


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

    var external_id = req.query.external_id
    var sucursal = parseInt(req.query.sucursal);
    var caja = parseInt(req.query.caja);
    var consultas = req.query.consultas;

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];
    var tokenMP = arrayValidado[2];

    console.log('\n\n\n---Consultando cobros.get---');
    func.appendLogs('\n\n\n---Consultando cobros.get---');

    let columnSucursal = await funcCob.sucursalOk(sucursal, subdomain, query).catch(error => {

        return res.status(400).json({ error: error });
    })

    if (columnSucursal[0].sucursal === '1') {

        sucursalOk = true

        let columnCaja = await funcCob.cajaOk(sucursal, caja, subdomain, query).catch(error => {

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

        if (consultas > 15) {

            let dataOrder = await funcCob.getOrderMP(external_id, tokenMP).catch(error => {

                return res.status(400).json({ error: error });
            })

            let body = dataOrder[0];
            let id_mp = dataOrder[1];

            await funcCob.updateCobros(id_mp, body, params).catch(error => {

                return res.status(400).json({ error: error });
            })

            let dataCobros = await funcCob.selectDataCobros(query).catch(error => {

                return res.status(400).json({ error: error });
            })

            if (dataCobros[0].estado == 'closed') {

                await funcCob.updateOkCaja(query).catch(error => {

                    return res.status(400).json({ error: error });
                })
            }
            console.log("\nResponse: ", dataCobros);
            func.appendLogs("\nResponse: " + dataCobros);
            return res.status(200).send(dataCobros);
        }
        else {

            let conditionDataCobro = await funcCob.selectConditionalDataCobro(subdomain, external_id, query).catch(error => {

                return res.status(400).json({ error: error });
            })

            if (conditionDataCobro.length == 0) {
                let error = "No se encontro el cobro."
                console.log(error);
                func.appendLogs(error);
                return res.status(400).json({ error: error });
            }
            else {

                if (conditionDataCobro[0].estado == 'closed') {

                    await funcCob.updateOkCaja(query).catch(error => {

                        return res.status(400).json({ error: error });
                    })
                }

                console.log("\nResponse: ", conditionDataCobro);
                func.appendLogs("\nResponse: " + conditionDataCobro);

                return res.status(200).send(conditionDataCobro);
            }
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

module.exports = router;
