var funcNot = {};
const request = require('request');
var func = require('../../server-functions');
var pgDatabase = require('../../DB');


async function getIDPayments(id_order, tokenMP) {

    return new Promise((fullfill, errorr) => {

        var respuesta = [];

        var GET_IdPayment = {
            'method': 'GET',
            'url': 'https://api.mercadopago.com/v1/payments/' + id_order,
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + ''
            }
        };

        console.log("\n-GET a Mercado Pago PAYMENTS:");
        console.log(GET_IdPayment);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        request(GET_IdPayment, (error, response) => {
            // console.log(response.body);
            // console.log(response.statusCode);
            if (error) {
                errorr(error);
            }

            id_order = JSON.parse(response.body).order.id;
            let body_payments = response.body;
            func.appendLogs(body_payments)

            let id_payments = JSON.parse(response.body).id;
            let monto = JSON.parse(response.body).transaction_amount;
            let external_id = parseInt(JSON.parse(response.body).external_reference);

            respuesta.push(id_payments);
            respuesta.push(monto);
            respuesta.push(external_id);
            respuesta.push(id_order);
            respuesta.push(body_payments);

            fullfill(respuesta)

            // console.log(id_order);
        });
    })

}


async function selectPayments(id_payments, query) {
    let miError = "Error al buscar payments en DB.";
    return new Promise((response, error) => {

        var queryPaymentsLength = "SELECT * FROM payments WHERE id_payments = " + id_payments;

        console.log("\n-Query: " + queryPaymentsLength);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryPaymentsLength, query).then(async function (dataPayments) {

            response(dataPayments);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function insertPayment(id_payments, id_order, external_id, body_payments, monto, query) {
    let miError = "Error al insertar payment en DB.";
    return new Promise((response, error) => {

        var queryPayments = "INSERT INTO payments (id_payments, id_order, external_id, body, monto, time) VALUES (" + id_payments + ", " + id_order + ", " + external_id + ", '" + body_payments + "', " + monto + ", CURRENT_TIMESTAMP);"
        console.log("\n-Query: " + queryPayments);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryPayments, query).then(async function (insertPayment) {

            response();

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function updatePayments(body_payments, monto, id_payments, query) {
    let miError = "Error al actualizar payment en DB.";
    return new Promise((response, error) => {

        var UPDATE_Payments = "UPDATE payments SET body = '" + body_payments + "', monto = " + monto + ", time = CURRENT_TIMESTAMP WHERE id_payments = " + id_payments;

            console.log("\n-Query: " + UPDATE_Payments);
            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");


            pgDatabase.query(UPDATE_Payments, query).then(async function (DataUpdatePAY) {

                console.log("El payment fue actualizado exitosamente.");
                response();
            
            }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function selectCobro(id_order, topic, query) {
    let miError = "Error al buscar cobro en DB.";
    return new Promise((response, error) => {

        var queryInitial = "SELECT * FROM cobros WHERE id_mp = " + id_order + " AND topic = " + "'" + topic + "'";
        console.log("\n-Query: " + queryInitial);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryInitial, query).then(function (dataNotifications) {

            response();

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function getExternalId(id_order, tokenMP) {

    return new Promise((fullfill, errorr) => {
        var respuesta = [];

        var GET_ExternalId = {
            'method': 'GET',
            'url': 'https://api.mercadopago.com/merchant_orders/' + id_order,
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + ''
            }
        };
        
        console.log("\n-GET a Mercado Pago ORDERS:");
        console.log(GET_ExternalId);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
        
        request(GET_ExternalId, (error, response) => {
            // console.log(response.body);
            // console.log(response.statusCode);
            if (error) {
                errorr(error);
            }

            let external_id = JSON.parse(response.body).external_reference;
            let status = JSON.parse(response.body).status;
            let order_status = JSON.parse(response.body).order_status;
            let body = response.body;

            respuesta.push(external_id);
            respuesta.push(status);
            respuesta.push(order_status);
            respuesta.push(body);
        
            func.appendLogs(body);

            fullfill(respuesta);
        });
    })

}


async function updateCobros(id_order, topic, body, estado, external_id, params) {
    let miError = "Error al actualizar cobro en DB.";
    return new Promise((response, error) => {

        queryPOST = "UPDATE cobros SET id_mp = " + id_order + ", topic = '" + topic + "', time = CURRENT_TIMESTAMP, body = '" + body + "', estado = '" + estado + "' WHERE external_id = " + external_id;

        console.log("\n-Query: " + queryPOST);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
        
        pgDatabase.query(queryPOST, params).then(async data => {
        
            response();
            
        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}



funcNot.getIDPayments = getIDPayments;
funcNot.selectPayments = selectPayments;
funcNot.insertPayment = insertPayment;
funcNot.selectCobro = selectCobro;
funcNot.getExternalId = getExternalId;
funcNot.updateCobros = updateCobros;
funcNot.updatePayments = updatePayments;



module.exports = funcNot;