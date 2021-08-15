var funcReg = {};
const request = require('request');
var func = require('../../server-functions');
var pgDatabase = require('../../DB');


async function sucursalesRegistroMP(sucursales, user_id, tokenMP) {

    return new Promise((fullfill, errorr) => {
        var respuesta = [];
        let name = sucursales[0].nombre
        let external_sucursal_id = sucursales[0].external_id
        let street_number = sucursales[0].numero
        let street_name = sucursales[0].calle
        let city = sucursales[0].ciudad
        let state = sucursales[0].provincia
        let latitude = sucursales[0].latitud
        let longitude = sucursales[0].longitud

        var crearSucursal = {

            'method': 'POST',
            'url': 'https://api.mercadopago.com/users/' + user_id + '/stores',
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + '',
                'Content-Type': 'application/json'
            },

            body: {
                "name": '' + name + '',
                "business_hours": {

                    "monday": [
                        {
                            "open": "08:00",
                            "close": "12:00"
                        }
                    ],
                    "tuesday": [
                        {
                            "open": "09:00",
                            "close": "18:00"
                        }
                    ]
                },
                "location": {
                    "street_number": '' + street_number + '',
                    "street_name": '' + street_name + '',
                    "city_name": '' + city + '',
                    "state_name": '' + state + '',
                    "latitude": + latitude,
                    "longitude": + longitude,
                    "reference": '' + name + ''
                },
                "external_id": '' + external_sucursal_id + '',
            },
            json: true
        }

        console.log("\n-Registro de la Sucursal:");
        console.log(crearSucursal);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        request(crearSucursal, function (error, response) {

            if (error) {
                errorr(error);
            }

            // console.log(response)
            console.log(response.body);
            func.appendLogs(response.body);
            func.appendLogs(response.statusCode);
            console.log(response.statusCode);

            let id_mp_suc = response.body.id

            respuesta.push(id_mp_suc);
            console.log(respuesta);

            fullfill(respuesta);
        }, 35000);
    })

}


async function sucursalesBuscarMP(user_id, tokenMP, external_id_store) {

    return new Promise((fullfill, errorr) => {

        var respuesta = [];

        var buscarExternalSucursal = {

            'method': 'GET',
            'url': 'https://api.mercadopago.com/users/' + user_id + '/stores/search?external_id=' + external_id_store,
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + ''
            }
        }

        console.log("\n-Busqueda de la Sucursal en Mercado Pago:");
        console.log(buscarExternalSucursal);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


        request(buscarExternalSucursal, (error, response) => {

            if (error) {
                errorr(error);
            }

            // console.log(response);
            // console.log(response.body);
            func.appendLogs(response.body);
            func.appendLogs(response.statusCode);
            console.log(response.statusCode);

            bodySuc = JSON.parse(response.body);
            console.log(bodySuc);

            if (bodySuc['results'] == undefined) {
                id_mp_suc = undefined
            }
            else {

                bodySucResults = bodySuc.results
                id_mp_suc = bodySucResults[0].id;
            }

            respuesta.push(id_mp_suc);
            console.log(respuesta);

            fullfill(respuesta)
        }, 5000);
    })
}


async function cajasRegistroMP(tokenMP, nro_caja, id_mp_suc, external_id_store, external_id_pos) {

    return new Promise((fullfill, errorr) => {
        var respuesta = [];

        var crearCaja = {

            'method': 'POST',
            'url': 'https://api.mercadopago.com/pos?access_token=' + tokenMP,
            'headers': {
                'Authorization': 'Bearer ' + "'" + tokenMP + "'",
                'Content-Type': 'application/json'
            },
            body: ({
                "name": "Caja Nro " + nro_caja,
                "fixed_amount": true,
                "category": 621102,
                "store_id": parseInt(id_mp_suc),
                "external_store_id": external_id_store,
                "external_id": external_id_pos
            }),
            json: true

        };

        console.log("\n-Registro de la Caja:");
        console.log(crearCaja);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        request(crearCaja, function (error, response) {

            if (error) {
                errorr(error);
            }
            // console.log(response)
            console.log(response.body);
            func.appendLogs(response.body);
            func.appendLogs(response.statusCode);
            console.log(response.statusCode);

            let qr = response.body.qr_code
            let id_mp_pos = response.body.id

            respuesta.push(id_mp_pos);
            respuesta.push(qr);

            fullfill(respuesta)

        });
    })
}


async function cajasBuscarMP(tokenMP, external_id_pos) {

    return new Promise((fullfill, errorr) => {
        var respuesta = [];

        var buscarExternalCaja = {
            'method': 'GET',
            'url': 'https://api.mercadopago.com/pos?external_id=' + external_id_pos,
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + ''
            }
        }

        console.log("\n-Buscar Caja:");
        console.log(buscarExternalCaja);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


        request(buscarExternalCaja, function (error, response) {

            if (error) {
                errorr(error);
            }

            console.log(response.body);
            func.appendLogs(response.body);
            func.appendLogs(response.statusCode);
            bodyPos = JSON.parse(response.body).results;

            if (bodyPos[0] == undefined) {
                id_mp_pos = undefined;
                qr = undefined
            }
            else {
                id_mp_pos = bodyPos[0].id;
                qr_body = bodyPos[0].qr_code;
                qr = qr_body;

            }

            respuesta.push(id_mp_pos);
            respuesta.push(qr);

            fullfill(respuesta);
        }, 5000);
    });

}


function asyncSucursalMP(sucursales, user_id, tokenMP, external_id_store) {

    return new Promise(async function (response, error) {
        let miError = "Error al buscar sucursal en MP.";

        dataBusqueda = await sucursalesBuscarMP(user_id, tokenMP, external_id_store).catch(e => {

            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

        console.log(dataBusqueda);

        if (dataBusqueda[0] == undefined || dataBusqueda[0] == null) {
            dataRegistro = await sucursalesRegistroMP(sucursales, user_id, tokenMP).catch(e => {
                miError = "Error al registrar sucursal en MP.";
                console.log(miError);
                e = miError;
                func.appendLogs(e);
                error(e);
            })
            console.log(dataRegistro);

            response(dataRegistro[0]);
        }
        else {

            response(dataBusqueda[0]);
        }

    });
}


function asyncCajaMP(tokenMP, nro_caja, id_mp_suc, external_id_store, external_id_pos) {

    return new Promise(async function (response, error) {
        let miError = "Error al buscar caja en MP.";

        dataBusqueda = await cajasBuscarMP(tokenMP, external_id_pos).catch(e => {

            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });
        console.log(dataBusqueda);

        if (dataBusqueda[0] == undefined || dataBusqueda[0] == null) {
            dataRegistro = await cajasRegistroMP(tokenMP, nro_caja, id_mp_suc, external_id_store, external_id_pos).catch(e => {
                miError = "Error al registrar caja en MP.";

                console.log(miError);
                e = miError;
                func.appendLogs(e);
                error(e);
            });
            console.log(dataRegistro);

            response(dataRegistro);

        }
        else {

            response(dataBusqueda);
        }
    });
}


async function sucursalOkDB(query, sucursal, subdomain) {

    return new Promise((response, error) => {

        let miError = "Error al validar sucursal OK.";

        var primerQuery = "SELECT COUNT(*) AS sucursal FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
        // console.log(primerQuery);

        pgDatabase.query(primerQuery, query).then(columnSucursal => {

            if (columnSucursal[0].sucursal == '1') {

                sucursalOk = true;

                response(sucursalOk);
            }

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });
    });

}


async function validarSucursalDB(query, sucursal, subdomain) {

    return new Promise((response, error) => {

        let miError = "Error al validar sucursal en DB.";

        var queryValidarSucursal = "SELECT * FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
        func.appendLogs(queryValidarSucursal);
        console.log("\n-Query: " + queryValidarSucursal);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryValidarSucursal, query).then(sucursalConsultada => {

            response(sucursalConsultada[0].id_mp);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function updateIdStore(external_id_store, query, sucursal, subdomain) {

    return new Promise((response, error) => {

        let miError = "Error al actualizar external_id_store en DB.";

        var queryIdStore = "UPDATE sucursales SET external_id = '" + external_id_store + "' WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "';"
        func.appendLogs(queryIdStore);
        console.log("\n-Query: " + queryIdStore);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryIdStore, query).then(function () {

            response();

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function selectSucursal(query, sucursal, subdomain) {

    return new Promise((response, error) => {

        let miError = "Error al buscar sucursal en DB.";

        var querySucursal = "SELECT * FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
        func.appendLogs(querySucursal);
        console.log("\n-Query: " + querySucursal);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(querySucursal, query).then(async function (sucursales) {

            response(sucursales);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function updateSucursalDB(id_mp_suc, external_id_store) {

    return new Promise((response, error) => {

        let miError = "Error al actualizar sucursal en DB.";

        queryUPDATESucursal = "UPDATE sucursales SET id_mp = " + id_mp_suc + " WHERE external_id = '" + external_id_store + "'";
        func.appendLogs(queryUPDATESucursal);
        console.log("\n-Query: " + queryUPDATESucursal);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryUPDATESucursal).then(function () {

            response();

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function buscarNroCajaDB(nro_caja, query) {

    return new Promise((response, error) => {

        let miError = "Error al buscar nro de caja en DB.";

        var queryBuscarCaja = "SELECT * FROM cajas WHERE caja = " + nro_caja + ""
        func.appendLogs(queryBuscarCaja);
        console.log("\n-Query: " + queryBuscarCaja);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryBuscarCaja, query).then(async function (nroCaja) {

            response();

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function buscarCajaDB(nro_caja, query, sucursal, subdomain) {

    return new Promise((response, error) => {

        let miError = "Error al buscar caja en DB.";

        var queryBuscarCaja = "SELECT * FROM cajas WHERE caja = " + nro_caja + " AND sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
        func.appendLogs(queryBuscarCaja);
        console.log("\n-Query: " + queryBuscarCaja);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryBuscarCaja, query).then(async function (cajaDB) {

            response(cajaDB);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function insertCajaDB(nro_caja, sucursal, subdomain, qr, id_mp_pos, external_id_pos) {

    return new Promise((response, error) => {

        let miError = "Error al insertar caja en DB.";

        queryCaja = "INSERT INTO cajas (sucursal, dominio, caja, qr, id_mp, external_id) VALUES ('" + sucursal + "', '" + subdomain + "', '" + nro_caja + "', '" + qr + "', '" + id_mp_pos + "', '" + external_id_pos + "')";
        func.appendLogs(queryCaja);
        console.log("\n-Query: " + queryCaja);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryCaja).then(() => {

            console.log("\nResponse: ", qr);
            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

            // return res.status(200).json({ qr: qr });

            response();

        }, (err => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(err);
        }));

    });

}


async function selectQR(nro_caja, sucursal) {

    return new Promise((response, error) => {

        let miError = "Error al buscar QR en DB.";

        var queryQr = "SELECT qr FROM cajas WHERE caja = '" + nro_caja + "' AND sucursal = '" + sucursal + "'"
        func.appendLogs(queryQr);
        console.log("\n-Query: " + queryQr);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


        pgDatabase.query(queryQr).then(data => {

            // console.log(response[0]);

            let qr_code = Object.values(data[0])
            let qr = qr_code[0]

            // console.log(qr);

            console.log("\nResponse: ", qr);
            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

            response(qr)

            // return res.status(200).json({ qr: qr });

        }, err => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(err);
        });

    });

}


async function idMPSucursal(subdomain, query) {
    let miError = "Error al buscar id_mp_suc en DB.";
    return new Promise((response, error) => {

        var buscarStore = "SELECT id_mp FROM sucursales WHERE sucursal = ${sucursal} AND dominio = '" + subdomain + "'";
        func.appendLogs(buscarStore);

        pgDatabase.query(buscarStore, query).then(async function (dataStore) {

            console.log(dataStore);
            let id_mp_suc = dataStore[0].id_mp;

            response(id_mp_suc);

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}



funcReg.asyncSucursalMP = asyncSucursalMP;
funcReg.asyncCajaMP = asyncCajaMP;
funcReg.sucursalOkDB = sucursalOkDB;
funcReg.validarSucursalDB = validarSucursalDB;
funcReg.updateIdStore = updateIdStore;
funcReg.selectSucursal = selectSucursal;
funcReg.updateSucursalDB = updateSucursalDB;
funcReg.buscarNroCajaDB = buscarNroCajaDB;
funcReg.buscarCajaDB = buscarCajaDB;
funcReg.insertCajaDB = insertCajaDB;
funcReg.selectQR = selectQR;
funcReg.idMPSucursal = idMPSucursal;


module.exports = funcReg;