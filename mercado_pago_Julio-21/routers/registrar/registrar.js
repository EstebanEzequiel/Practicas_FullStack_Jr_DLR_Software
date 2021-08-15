var express = require('express');
var router = express.Router({ mergeParams: true });
var path = '/registrar/';
var fs = require("fs");
const { errors } = require('pg-promise');
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
var funcReg = require('./registrar-func')
var domains = conf.domains;

router.post(path, async function (req, res) {

    var query = req.query;
    var subdomain = req.params.domain;
    var token = req.query.token;
    var tokenMP = '';
    var arrayValidado = [];
    var arrayCaja = [];

    var token_encontrado = false
    var subD_encontrado = false
    var sucursalOk = false

    if (((req.query['sucursal'] == undefined) && (req.query['caja'] == undefined)) || ((req.query['sucursal'] == undefined)) || ((req.query['caja'] == undefined))) {
        let error = "Sucursal y/o caja no tienen valores validos o no fueron mandados como parametros."
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error });
    }

    var sucursal = parseInt(req.query.sucursal)
    var nro_caja = parseInt(req.query.caja)

    arrayValidado = func.dominioToken(domains, token, subdomain)
    subD_encontrado = arrayValidado[0]
    token_encontrado = arrayValidado[1]

    console.log("\n\n\n---Consultando registrar.post---");
    func.appendLogs("\n\n\n---Consultando registrar.post---");

    sucursalOk = await funcReg.sucursalOkDB(query, sucursal, subdomain).catch(error => {

        return res.status(400).json({ error: error });

    });

    if (token_encontrado && sucursalOk) {

        tokenMP = arrayValidado[2]
        var token_bruto = tokenMP
        var token_en_array = token_bruto.split("-")

        var n = token_en_array.length
        var user_id = token_en_array[n - 1]

        var external_id_store = subdomain + (sucursal + '').padStart(4, '0');
        var medio_pos_id = (nro_caja + '').padStart(4, '0')
        var external_id_pos = external_id_store + medio_pos_id

        var sucursalConsultadaIDMP = await funcReg.validarSucursalDB(query, sucursal, subdomain).catch(error => {

            return res.status(400).json({ error: error });
        });

        if (sucursalConsultadaIDMP === null || sucursalConsultadaIDMP === 0) {

            // console.log(external_id_store);

            await funcReg.updateIdStore(external_id_store, query, sucursal, subdomain).catch(error => {
                return res.status(400).json({ error: error });
            })


            var sucursales = await funcReg.selectSucursal(query, sucursal, subdomain).catch(error => {
                return res.status(400).json({ error: error });
            })

            // console.log(sucursales[0].dominio);

            var id_mp_suc = await funcReg.asyncSucursalMP(sucursales, user_id, tokenMP, external_id_store).catch(error => {

                return res.status(400).json({ error: error });

            });

            console.log("FUNCION SUC INI");
            console.log(id_mp_suc);
            console.log("FUNCION SUC FIN");

            await funcReg.updateSucursalDB(id_mp_suc, external_id_store).catch(error => {

                return res.status(400).json({ error: error });

            })
        }

        let cajaDB = await funcReg.buscarCajaDB(nro_caja, query, sucursal, subdomain).catch(error => {

            return res.status(400).json({ error: error });

        })


        console.log(cajaDB);

        if (cajaDB.length == 0) {


            id_mp_suc = await funcReg.idMPSucursal(subdomain, query).catch(error => {

                return res.status(400).json({ error: error });
            })


            arrayCaja = await funcReg.asyncCajaMP(tokenMP, nro_caja, id_mp_suc, external_id_store, external_id_pos).catch(error => {

                return res.status(400).json({ error: error });

            })

            let id_mp_pos = arrayCaja[0];
            let qr = arrayCaja[1];

            console.log("FUNCION POS INI");
            console.log(id_mp_pos);
            console.log(qr);
            console.log("FUNCION POS FIN");


            await funcReg.insertCajaDB(nro_caja, sucursal, subdomain, qr, id_mp_pos, external_id_pos).catch(error => {

                return res.status(400).json({ error: error });

            })

        }

        qr = await funcReg.selectQR(nro_caja, sucursal).catch(error => {
            return res.status(400).json({ error: error });
        })


        return res.status(200).json({ qr: qr });

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