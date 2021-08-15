var funcDev = {};
const request = require('request');
var func = require('../../server-functions');
var pgDatabase = require('../../DB');


//----------FUNCIONES DEVOLUCION.POST----------


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


async function selectPayment(query, subdomain, pv, tipo, numero, id_cobro) {
    let miError = "Error al buscar payment en DB.";
    return new Promise((response, error) => {

        let cWhere = "WHERE c.sucursal = ${sucursal} AND c.caja = ${caja} AND dominio = '" + subdomain + "' AND c.external_id = " + id_cobro;
        if (id_cobro == 0) {
            cWhere = "WHERE c.sucursal = ${sucursal} AND c.caja = ${caja} AND dominio = '" + subdomain + "' AND c.pv = " + pv + " AND c.tipo = " + tipo + " AND c.numero = " + numero;
        }

        // var queryInitial = "SELECT * FROM cobros WHERE (dominio = " + "'" + subdomain + "'" + " AND sucursal = ${sucursal} AND caja = ${caja} AND external_id = ${external_id }) OR (dominio = '" + subdomain + "' AND sucursal = ${sucursal} AND caja = ${caja} AND pv = ${pv} AND tipo = ${tipo} AND numero = ${numero})";
        var queryInitial = "SELECT p.*, p.body -> 'status' as estado FROM payments p LEFT JOIN cobros c ON p.external_id = c.external_id " + cWhere;
        func.appendLogs(queryInitial);

        console.log("\n-Query: " + queryInitial);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryInitial, query).then(async function (dataDev) {
            console.log(dataDev);

            response(dataDev)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function devMP(id_payments, tokenMP, monto, estado) {

    return new Promise((fullfill, errorr) => {

        var respuesta = [];

        var DEV = {
            'method': 'POST',
            'url': 'https://api.mercadopago.com/v1/payments/' + id_payments + '/refunds',
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + '',
                'Content-Type': 'application/json'
            },
            body: {
                "amount": monto
            },

            json: true
        };

        console.log("\n-Registro de la Devolucion:");
        console.log(DEV);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");


        request(DEV, (error, response) => {
            if (error) {
                errorr(error);
            }

            console.log(response.body);
            console.log(response.statusCode);
            let body_dev = response.body;
            // console.log(body_dev);


            func.appendLogs(body_dev);
            func.appendLogs(response.statusCode);

            console.log(response.body.error);
            if (response.body.error) {

                let error = "Error al registrar la devolucion en Mercado Pago."
                // func.appendLogs(reponse.body.error);
                func.appendLogs(error);
                respuesta.push(error);

            } else {

                let id_mp = body_dev.id;
                let status = body_dev.status;
                console.log(id_mp);
                console.log(status);

                if (status === 'approved') {
                    estado = 'cerrado';
                }

                respuesta.push(id_mp);
                respuesta.push(body_dev);
                respuesta.push(estado);
            }

            fullfill(respuesta);
        });
    })

}


async function insertDevolucion(sucursal, subdomain, caja, id_cobro, id_payments, body_dev, monto, id_mp, estado, query) {
    let miError = "Error al insertar devolucion en DB.";
    return new Promise((response, error) => {

        var queryPOST = "INSERT INTO devoluciones (sucursal, dominio, caja, id_cobro, id_payments, fecha, body, monto, id_mp, estado) VALUES (" + "'" + sucursal + "'" + ", " + "'" + subdomain + "', " + "'" + caja + "', " + "'" + id_cobro + "'" + ", " + id_payments + ", CURRENT_TIMESTAMP, '" + JSON.stringify(body_dev) + "', " + monto + ", " + id_mp + ", '" + estado + "'); SELECT id_dev FROM devoluciones ORDER BY id_dev DESC LIMIT 1";
        console.log("\n-Query: " + queryPOST);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
        func.appendLogs(queryPOST);

        pgDatabase.query(queryPOST, query).then(async data => {

            let result_ids = data[0];
            ids = Object.values(result_ids);
            let id_dev = ids[0];

            response(id_dev);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function updateCobrosDev(id_dev, id_cobro, body_dev, query) {
    let miError = "Error al actualizar cobro en DB.";
    return new Promise((response, error) => {

        var DevInCobro = "UPDATE cobros SET devolucion = " + id_dev + " WHERE external_id = " + id_cobro;
        console.log("\n-Query: " + DevInCobro);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
        func.appendLogs(DevInCobro);

        pgDatabase.query(DevInCobro, query).then(data => {
            console.log("\nResponse: id_dev: " + id_dev + "\nbody: " + body_dev);
            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
            func.appendLogs("\nResponse: id_dev: " + id_dev + "\nbody: " + body_dev);

            response();
            
        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


//----------FUNCIONES DEVOLUCION.GET----------


async function selectDev(subdomain, external_id, query) {
    let miError = "Error al buscar devolucion en DB.";
    return new Promise((response, error) => {

        let dWhere = "WHERE c.external_id = ${external_id}";
        if (external_id == 0) {
            dWhere = "WHERE c.dominio = '" + subdomain + "' AND c.pv = ${pv} AND c.tipo = ${tipo} AND c.numero = ${numero}";
        }

        var queryInitial = "SELECT d.* FROM devoluciones d LEFT JOIN cobros c ON d.id_cobro = c.external_id " + dWhere;
        // var queryInitial = "SELECT * FROM devoluciones WHERE id_cobro = ${id_cobro} AND id_dev = ${id_dev} AND dominio = " + "'" + subdomain + "'";
        console.log("\n-Query: " + queryInitial);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");
        func.appendLogs(queryInitial);

        pgDatabase.query(queryInitial, query).then(async function (dataDev) {

            response(dataDev)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


//----------FUNCIONES ULTIMADEVOLUCION.GET----------


async function selectUltimaDev(query, subdomain) {
    let miError = "Error al buscar ultima devolucion en DB.";
    return new Promise((response, error) => {

        var queryInitial = "SELECT d.* FROM devoluciones d LEFT JOIN cobros c ON d.id_cobro = c.external_id WHERE c.dominio = '" + subdomain + "' AND c.caja = ${caja} AND c.sucursal = ${sucursal} ORDER BY d.id_cobro DESC LIMIT 1 ";
        // var queryInitial = "SELECT * FROM devoluciones WHERE id_cobro = ${id_cobro} AND id_dev = ${id_dev} AND dominio = " + "'" + subdomain + "'";
        console.log("\n-Query: " + queryInitial);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");
        func.appendLogs(queryInitial);

        pgDatabase.query(queryInitial, query).then(async function (dataDev) {

            response(dataDev);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}



funcDev.sucursalOk = sucursalOk;
funcDev.cajaOk = cajaOk;
funcDev.selectPayment = selectPayment;
funcDev.devMP = devMP;
funcDev.insertDevolucion = insertDevolucion;
funcDev.updateCobrosDev = updateCobrosDev;
funcDev.selectDev = selectDev;
funcDev.selectUltimaDev = selectUltimaDev;


module.exports = funcDev;