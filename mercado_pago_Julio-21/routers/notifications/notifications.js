var express = require('express');
var router = express.Router({ mergeParams: true });
const path = '/notifications/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
const funcNot = require('./notifications-func');
const domains = conf.domains;

router.post(path, async function (req, res) {

    var subdomain = req.params.domain;
    var subD_encontrado = false;
    var tokenMP = '';
    var estado = '';
    var query = req.query;
    var params = req.params;

    console.log("\n\n\n---Consultando notifications.post---");
    func.appendLogs("\n\n\n---Consultando notifications.post---");

    for (let element of domains) {

        if (subdomain === element.domain) {
            subD_encontrado = true
            tokenMP = element.tokenMP
        }
    }

    if (subD_encontrado) {

        let campos = [req.query];
        var valores_campos = Object.values(campos[0]);
        var id_order = valores_campos[0];
        var topic = valores_campos[1];
        // console.log(campos);


        if (valores_campos[1] === 'payment') {

            topic = "merchant_order"

            let dataPaymentsID = await funcNot.getIDPayments(id_order, tokenMP).catch(error => {

                return res.status(400).json({ error: error });
            })

            let id_payments = dataPaymentsID[0];
            let external_id = dataPaymentsID[2];
            let body_payments = dataPaymentsID[4];
            let monto = dataPaymentsID[1];
            id_order = dataPaymentsID[3]

            dataPayments = await funcNot.selectPayments(id_payments, query).catch(error => {

                return res.status(400).json({ error: error });
            })

            // console.log(dataPayments);
            if (dataPayments.length === 0) {

                await funcNot.insertPayment(id_payments, id_order, external_id, body_payments, monto, query).catch(error => {

                    return res.status(400).json({ error: error });
                })

            } else {

                await funcNot.updatePayments(body_payments, monto, id_payments, query).catch(error => {

                    return res.status(400).json({ error: error });
                })
            }
        }

        topic = "merchant_order"

        await funcNot.selectCobro(id_order, topic, query).catch(error => {

            return res.status(400).json({ error: error });
        })


        let dataExternalID = await funcNot.getExternalId(id_order, tokenMP).catch(error => {

            return res.status(400).json({ error: error });
        })

        // console.log(dataExternalID);

        let external_id = dataExternalID[0];
        let body = dataExternalID[3];
        let order_status = dataExternalID[2];
        let status = dataExternalID[1];

        if (status === 'closed' && order_status === 'paid') {
            estado = "cerrado";
        }

        await funcNot.updateCobros(id_order, topic, body, estado, external_id, params).catch(error => {

            return res.status(400).json({ error: error });
        })


        return res.status(200).json();

    }

    if (!subD_encontrado) {
        let error = 'El subdominio no pertenece a un cliente.';
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error })
    }
});

module.exports = router;
