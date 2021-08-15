const express = require('express');
const router = express.Router();
const path = 'domain'

/**
** ruta: /mercadopago/domain/cualquier cosa que venga
*/

router.get(`/${path}`, (req, res) => {
    
    var domain = req.query.domain;
    var token = req.query.token

    conf.array.push({

        "domain": "'"+domain+"'",
        "token": "'"+token+"'"
    })

    conf.array.forEach(indice =>{
        console.log(indice);
    })


})

module.exports = router