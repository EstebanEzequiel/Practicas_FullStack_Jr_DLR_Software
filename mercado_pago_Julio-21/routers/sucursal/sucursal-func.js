var funcSuc = {};
var func = require('../../server-functions');
var pgDatabase = require('../../DB');


async function validarSucursalDB(sucursal, subdomain, query) {
    let miError = "Error al validar sucursal en DB.";
    return new Promise((response, error) => {

        var primerQuery = "SELECT COUNT(*) AS sucursal FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"

        pgDatabase.query(primerQuery, query).then(async function (sucursal) {

            response(sucursal)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


async function insertSucursalDB(sucursal, nombre, subdomain, ciudad, provincia, latitud, longitud, calle, numero) {
    let miError = "Error al insertar sucursal en DB.";
    return new Promise((response, error) => {

        var queryInsertar = "INSERT INTO sucursales (sucursal, nombre, dominio, ciudad, provincia, latitud, longitud, calle, numero) VALUES ('" + sucursal + "', '" + nombre + "', '" + subdomain + "', '" + ciudad + "', '" + provincia + "', " + latitud + ", " + longitud + ", '" + calle + "', " + numero + ")";
        func.appendLogs(queryInsertar);
        console.log("\n-Query: " + queryInsertar);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


        pgDatabase.query(queryInsertar).then(() => {

            let respuesta = 'La sucursal fue registrada existosamente.'
            console.log('\nResponse: ' + respuesta);
            func.appendLogs(respuesta);
            response(respuesta)

        }).catch(e => {
            console.log(miError);
            e = miError;
            func.appendLogs(e);
            error(e);
        });

    });

}


funcSuc.validarSucursalDB = validarSucursalDB;
funcSuc.insertSucursalDB = insertSucursalDB;


module.exports = funcSuc;