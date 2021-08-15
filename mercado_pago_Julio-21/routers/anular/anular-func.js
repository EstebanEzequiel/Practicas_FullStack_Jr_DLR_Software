var funcAnu = {};
const request = require('request');
var func = require('../../server-functions');
var pgDatabase = require('../../DB');


async function orderCanceled(post_id, user_id, tokenMP) {

    return new Promise((fullfill, errorr) => {

        var order_canceled = {

            'method': 'DELETE',
            'url': 'https://api.mercadopago.com/instore/qr/seller/collectors/' + user_id + '/pos/' + post_id + '/orders',
            'headers': {
                'Authorization': 'Bearer ' + "'" + tokenMP + "'",
                'Cookie': '_d2id=e38bf0f3-1642-4e3c-8e2a-92fc4d18eda1-n'
            }
        };

        console.log("\n-Registro de la Anulacion de Orden:");
        console.log(order_canceled);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        request(order_canceled, function (error, response) {

            if (error) {
                errorr(error);
            }

            // console.log(response)
            console.log(response.body);
            func.appendLogs(response.body);
            func.appendLogs(response.statusCode);
            console.log(response.statusCode);

            fullfill();

        }, 10000);
    })

}


async function buscarCajaDB(sucursal, caja, query) {
    let miError = "Error al buscar caja en DB.";
    return new Promise((response, error) => {

        var queryCajas = "SELECT * FROM cajas WHERE sucursal = " + sucursal + " AND caja = " + caja
        func.appendLogs(queryCajas);
        console.log("\n-Query: " + queryCajas);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryCajas, query).then(async function (caja) {

            response(caja)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function buscarCobroDB(external_cobro_id, query) {
    let miError = "Error al buscar cobro en DB.";
    return new Promise((response, error) => {

        var queryCobros = "SELECT * FROM cobros WHERE external_id = '" + external_cobro_id + "'"
        func.appendLogs(queryCobros);
        console.log("\n-Query: " + queryCobros);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryCobros, query).then(async function (cobro) {

            response(cobro);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function updateCobroDB(external_cobro_id) {
    let miError = "Error al actualizar campo 'cancelled' de cobro en DB.";
    return new Promise((response, error) => {

        queryCancelled = "UPDATE cobros SET cancelled = true WHERE external_id = " + external_cobro_id + ";"
        func.appendLogs(queryCancelled);
        console.log("\n-Query: " + queryCancelled);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryCancelled).then(() => {
            let respuesta = 'Orden anulada.'
            console.log("\nResponse: Orden anulada.");
            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
            func.appendLogs(respuesta);

            response(respuesta);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


funcAnu.buscarCajaDB = buscarCajaDB;
funcAnu.buscarCobroDB = buscarCobroDB;
funcAnu.orderCanceled = orderCanceled;
funcAnu.updateCobroDB = updateCobroDB;



module.exports = funcAnu;