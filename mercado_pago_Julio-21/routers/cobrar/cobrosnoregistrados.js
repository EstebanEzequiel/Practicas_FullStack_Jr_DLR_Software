var express = require('express');
var router = express.Router({ mergeParams: true });
const path = '/cobrosnoregistrados/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
const funcCob = require('./cobrar-func');
const domains = conf.domains;


router.get(path, async (req, res) => {

  var subdomain = req.params.domain;
  var token = req.query.token;
  var token_encontrado = false;
  var subD_encontrado = false;
  var query = req.query;

  if (req.query['pv'] == undefined) {
    let error = "El punto de venta no tiene un valor valido o no fue mandado como parametro."
    console.log(error);
    func.appendLogs(error);
    res.status(400).json({ error: error });
  }

  var pv = req.query.pv

  var arrayValidado = [];

  arrayValidado = func.dominioToken(domains, token, subdomain);
  subD_encontrado = arrayValidado[0];
  token_encontrado = arrayValidado[1];


  console.log('\n\n\n---Consultando cobrosnoregistrados.get---');
  func.appendLogs('\n\n\n---Consultando cobrosnoregistrados.get---');

  if (token_encontrado){

    dataCobrosNoReg = await funcCob.selectCobrosNoReg(query, pv).catch(error => {
  
      return res.status(400).json({ error: error });
    })
  
    return res.status(200).send(dataCobrosNoReg);

  }


  if (!token_encontrado) {
    let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
    console.log(error);
    func.appendLogs(error);

    return res.status(400).json({ error: error })
  }

});

module.exports = router;
