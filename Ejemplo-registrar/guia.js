var subdomain = req.params.domain;
var token = ''

for (let element of domains) {

    if (subdomain === element.domain) {
        token = element.token
        break
    }
}

if (token === "") {
    return res.status(400).send('El subdominio no pertenece a un cliente')
}
else {

    console.log("Consultando pos.post");

    valores_name = [];
    valores_external_store = [];
    valores_external_id = [];
    valores_category = [];
    valores_amount = [];
    
    var queryInitial = "SELECT * FROM pos WHERE external_id = ${external_id} AND external_store_id = ${external_store_id}";

    pgDatabase.query(queryInitial, req.body).then(function (dataPos) {

        if (dataPos.length == 0) {

            let index = 0;
            let campos = [req.body]; 

            for (let k of campos) {

                if (k.external_id == undefined && k.name == undefined) {
                    console.log('El valor de la sucursal es undefined');
                }
                else {
                    valores_name.push(k.name),
                        valores_external_id.push(k.external_id),
                        valores_external_store.push(k.external_store_id),
                        valores_category.push(k.category),
                        valores_amount.push(k.fixed_amount)
                }

                index++;
            }

            var POST_pos = {

                'method': 'POST',
                'url': 'https://api.mercadopago.com/pos',
                'headers': {
                    'Authorization': 'Bearer APP_USR-6848942778215476-031814-e56e1d303b386321092244269f1eddb3-730655432',
                    'Content-Type': 'application/json'
                },
                body: {
                    "name":valores_name[0], 
                    "fixed_amount": valores_amount[0],
                    "category": valores_category[0],
                    "external_store_id": valores_external_store[0],
                    "external_id": valores_external_id[0]
                },
                json: true
            };
            
            request(POST_pos, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);

                let qr = response.body.qr_code

                queryPOST = "INSERT INTO pos (name, external_store_id, external_id, category, fixed_amount, qr) VALUES (" + "'" + valores_name + "'" + ", " + "'" + valores_external_store + "'" + ", " + "'" + valores_external_id + "'" + ", " + "'" + valores_category + "', " + "'" + valores_amount + "', " + "'" + qr + "'" + ")";
                console.log("Query: " + queryPOST);
                console.log("---------------------------------------------------------------------------");

                pgDatabase.query(queryPOST, req.params).then(data => {
                    return res.status(200).send(qr);
                })
                    .catch(function (error) { return res.sqlError(error.message) });
              });
        }
        else {
            return res.badRequest("La caja ya existe")
        }
    })
    .catch(function (error) { return res.sqlError(error.message) });

}
