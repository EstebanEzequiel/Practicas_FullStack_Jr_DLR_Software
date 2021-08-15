var funcCob = {};
const request = require('request');
var func = require('../../server-functions');
var pgDatabase = require('../../DB');
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));

//----------FUNCIONES COBRAR.POST----------


async function sucursalOk(sucursal, subdomain, query) {
    let miError = "Error al validar sucursal en DB.";
    return new Promise((response, error) => {

        var querySucursal = "SELECT COUNT(*) AS sucursal FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
        // console.log(querySucursal);

        pgDatabase.query(querySucursal, query).then(async function (columnSucursal) {

            // console.log(columnSucursal);
            response(columnSucursal);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function cajaOk(sucursal, caja, subdomain, query) {
    let miError = "Error al validar caja en DB.";
    return new Promise((response, error) => {

        var queryCaja = "SELECT COUNT(*) AS caja FROM cajas WHERE sucursal = " + sucursal + " AND caja = " + caja + " AND dominio = '" + subdomain + "'"
        // console.log(queryCaja);

        pgDatabase.query(queryCaja, query).then(async function (columnCaja) {

            response(columnCaja)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function selectCobro(query) {
    let miError = "Error al buscar cobro en DB.";
    return new Promise((response, error) => {

        var queryInitial = "SELECT * FROM cobros WHERE sucursal = ${sucursal} AND caja = ${caja}";
        func.appendLogs(queryInitial);
        console.log("\n-Query: " + queryInitial);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");


        pgDatabase.query(queryInitial, query).then(function (dataCobros) {

            response();

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function insertCobro(sucursal, subdomain, caja, pv, tipo, numero, monto, query) {
    let miError = "Error al insertar cobro en DB.";
    return new Promise((response, error) => {

        queryPOST = "INSERT INTO cobros (sucursal, dominio, caja, pv, tipo, numero, okcaja, monto) VALUES (" + "'" + sucursal + "'" + ", " + "'" + subdomain + "', " + "'" + caja + "', '" + pv + "', '" + tipo + "', '" + numero + "', 0, " + monto + "); SELECT * FROM cobros ORDER BY external_id DESC LIMIT 1";
        func.appendLogs(queryPOST);
        console.log("\n-Query: " + queryPOST);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryPOST, query).then(async data => {

            let result_ids = data[0];
            ids = Object.values(result_ids);
            external_id = ids[0];

            response(external_id)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function buscarId_Suc(sucursal, query) {
    let miError = "Error al buscar id_mp_suc en DB.";
    return new Promise((response, error) => {

        var GET_SucursalId = "SELECT external_id FROM sucursales WHERE sucursal = " + "'" + sucursal + "'";
        func.appendLogs(GET_SucursalId);

        pgDatabase.query(GET_SucursalId, query).then(async data => {
            let result_id_suc = data[0];
            id = Object.values(result_id_suc);
            id_sucursal = id[0];

            response(id_sucursal)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function buscarId_Caja(caja, sucursal, subdomain, query) {
    let miError = "Error al buscar id_mp_caja en DB.";
    return new Promise((response, error) => {

        var GET_CajaId = "SELECT external_id FROM cajas WHERE caja = " + caja + " AND sucursal = " + sucursal + " AND dominio = " + "'" + subdomain + "'";
        func.appendLogs(GET_CajaId);

        pgDatabase.query(GET_CajaId, query).then(async data => {
            let result_id_caja = data[0];
            id = Object.values(result_id_caja);
            id_caja = id[0];

            response(id_caja)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function putOrder(user_id, id_sucursal, id_caja, tokenMP, external_id, subdomain, monto) {

    return new Promise((fullfill, errorr) => {


        var PUT_order = {
            'method': 'PUT',
            'url': 'https://api.mercadopago.com/instore/qr/seller/collectors/' + user_id + '/stores/' + id_sucursal + '/pos/' + id_caja + '/orders',
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + '',
                'Content-Type': 'application/json'
            },
            body: {
                "external_reference": '' + external_id + '',
                "title": "Compra " + external_id,
                "description": "",
                "notification_url": conf.url_ipn + subdomain + "/notifications/",
                "expiration_date": "2023-08-22T16:34:56.559-04:00",
                "total_amount": monto,
                "items": [
                    {
                        "sku_number": "",
                        "category": "",
                        "title": "Compra " + external_id,
                        "description": "",
                        "unit_price": monto,
                        "quantity": 1,
                        "unit_measure": "unit",
                        "total_amount": monto
                    }
                ],

                // "sponsor_id": 777691928
            },

            json: true

        };

        if (conf.sponsor_id != 0) {
            Object.defineProperty(PUT_order.body, "sponsor", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: {
                    "id": conf.sponsor_id
                }
            });

            console.log(PUT_order.body);
        }

        // console.log(PUT_order.body);
        console.log("\n-Registro de la Orden:");
        console.log(PUT_order);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        request(PUT_order, function (error, response) {
            if (error) {
                errorr(error);
            }

            console.log(response.statusCode);
            console.log(response.body);
            let body_order = response.body;
            func.appendLogs(body_order);

            console.log("\nResponse: ", external_id);
            func.appendLogs("\nResponse: " + external_id);

            fullfill();

        });
    })

}


//----------FUNCIONES COBRAR.GET----------


async function getOrderMP(external_id, tokenMP) {

    return new Promise((fullfill, errorr) => {
        var respuesta = [];

        var GET_Notification = {
            'method': 'GET',
            'url': 'https://api.mercadopago.com/merchant_orders?external_reference=' + external_id,
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + ''
            }
        };

        console.log("\n-GET a Mercado Pago ORDERS:");
        console.log(GET_Notification);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        request(GET_Notification, (error, response) => {

            if (error) {
                errorr(error);
            }

            console.log(response.body);
            console.log(response.statusCode);

            let body = JSON.parse(response.body).elements[0];
            let id_mp = body.id
            func.appendLogs(body);

            respuesta.push(body);
            respuesta.push(id_mp);

            fullfill(respuesta);

        });
    })

}


async function updateCobros(id_mp, body, params) {
    let miError = "Error al actualizar cobro en DB.";
    return new Promise((response, error) => {

        queryPOST = "UPDATE cobros SET id_mp = " + id_mp + ", topic = 'merchant_order', time = CURRENT_TIMESTAMP, body = '" + JSON.stringify(body) + "' WHERE external_id = " + external_id;
        func.appendLogs(queryPOST);
        console.log("\n-Query: " + queryPOST);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryPOST, params).then(data => {

            response();

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function selectDataCobros(query) {
    let miError = "Error al buscar cobro en DB.";
    return new Promise((response, error) => {

        var queryInitial = "SELECT body, time, topic, id_mp, body -> 'status' as estado FROM cobros WHERE external_id = ${external_id}";
        func.appendLogs(queryInitial);
        console.log("\n-Query: " + queryInitial);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryInitial, query).then(async function (data) {

            response(data)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function selectConditionalDataCobro(subdomain, external_id, query) {
    let miError = "Error al actualizar cobro en DB.";
    return new Promise((response, error) => {

        var Where = "WHERE external_id = ${external_id}";
        if (external_id == 0) {
            Where = "WHERE dominio = '" + subdomain + "' AND pv = ${pv} AND tipo = ${tipo} AND numero = ${numero}";
        }

        var queryInitial = "SELECT body, time, topic, id_mp, body -> 'status' as estado FROM cobros " + Where;
        func.appendLogs(queryInitial);
        console.log("\n-Query: " + queryInitial);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryInitial, query).then(async function (data) {

            response(data);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function updateOkCaja(query) {
    let miError = "Error al actualizar cobro en DB.";
    return new Promise((response, error) => {

        var UPDATE_Cobros = "UPDATE cobros SET okcaja = 1 WHERE external_id = ${external_id}"
        func.appendLogs(UPDATE_Cobros);

        pgDatabase.query(UPDATE_Cobros, query).then(() => {
            console.log("\n-Query: " + UPDATE_Cobros);
            console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

            response();

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


//----------FUNCIONES COBROSNOREGISTRADOS.GET----------


async function selectCobrosNoReg(query, pv) {
    let miError = "Error al buscar cobros no registrados en DB.";
    return new Promise((response, error) => {

        var queryInitial = "SELECT *, body -> 'total_amount' AS monto FROM cobros WHERE id_mp IS NOT null AND okcaja = 0 AND pv = " + pv;
        func.appendLogs(queryInitial);
        console.log("\n-Query: " + queryInitial);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


        pgDatabase.query(queryInitial, query).then(async function (data) {

            // console.log(data);

            func.appendLogs("\nResponse: " + data);
            console.log("\nResponse: ", data);

            response(data)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


//----------FUNCIONES ULTIMOCOBRO.GET----------


async function selectUltimoCobro(query, subdomain, caja, sucursal) {
    let miError = "Error al buscar ultimo cobro en DB.";
    return new Promise((response, error) => {

        var queryInitial = "SELECT * FROM cobros WHERE dominio = '" + subdomain + "' AND caja = " + caja + " AND sucursal = " + sucursal + " ORDER BY external_id DESC LIMIT 1";
        func.appendLogs(queryInitial);
        console.log("\n-Query: " + queryInitial);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


        pgDatabase.query(queryInitial, query).then(async function (data) {

            func.appendLogs("\nResponse: " + data);
            console.log("\nResponse: ", data);
            
            response(data)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}



funcCob.sucursalOk = sucursalOk;
funcCob.cajaOk = cajaOk;
funcCob.selectCobro = selectCobro;
funcCob.insertCobro = insertCobro;
funcCob.buscarId_Suc = buscarId_Suc;
funcCob.buscarId_Caja = buscarId_Caja;
funcCob.putOrder = putOrder;
funcCob.getOrderMP = getOrderMP;
funcCob.updateCobros = updateCobros;
funcCob.selectDataCobros = selectDataCobros;
funcCob.selectConditionalDataCobro = selectConditionalDataCobro;
funcCob.updateOkCaja = updateOkCaja;
funcCob.selectCobrosNoReg = selectCobrosNoReg;
funcCob.selectUltimoCobro = selectUltimoCobro;



module.exports = funcCob;