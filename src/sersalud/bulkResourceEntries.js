const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.bulkResourceEntries = async (event, context) => {

  var timestamp = new Date().getTime();
  let body;
  let statusCode = 200;
  
  const headers = {
    "Content-Type": "application/json"
  };

  const resources =  [
    {
        "timestamp": "0",
        "cedula": "40229183500",
        "nombre": "ALBA IRIS FLORENTINO",
        "telefono": "8099750067",
        "cargo": "ENFERMERA BKP",
        "TIPO_SERVICIO_PERSONAL": "ENFERMERA",
        "TIPO_PERSONAL_EXTERNO": "PERSONAL BACKUP",
        "metodoDePago": "TRANSFERENCIA BANCARIA",
        "banco": "BANRESERVAS",
        "tipoDeCuenta": "CUENTA DE AHORRO DOP",
        "cuenta": "9601833384",
        "estado": "TRUE",
        "fechaDeInicio": "44504"
    },
    {
        "timestamp": "0",
        "cedula": "40224568721",
        "nombre": "ALBA VERONICA  HEYLIGER",
        "telefono": "8298146009",
        "cargo": "MEDICO GENERAL BKP",
        "TIPO_SERVICIO_PERSONAL": "MEDICO GENERAL",
        "TIPO_PERSONAL_EXTERNO": "PERSONAL BACKUP",
        "metodoDePago": "TRANSFERENCIA BANCARIA",
        "banco": "BANRESERVAS",
        "tipoDeCuenta": "CUENTA DE AHORRO DOP",
        "cuenta": "7400111148",
        "estado": "TRUE",
        "fechaDeInicio": "44400"
    }
  ]

// json.forEach(function(obj) { console.log(obj.id); });

for (i=0; i < resources.length; i++){

  console.log(resources[i] + "\n");

    try {

      let requestJSON = {};
      // requestJSON = JSON.parse(resources[i]);
      requestJSON = resources[i];
      
      switch (event.routeKey) {
        case "PUT /resources/bulk":

          // requestJSON = JSON.parse(event.body);
          resources[i].timestamp = new Date().getTime();

          await dynamo
            .put({
              TableName: "sersalud-resources-DEV",
              Item: resources[i]
            })
            .promise();
          body = `Post (inserted) item ${requestJSON.nombre}`;
          break;
        default:
          throw new Error(`Unsupported route: "${event.routeKey}"`);
      }
    } catch (err) {
      statusCode = 400;
      body = err.message;
    } finally {
      body = JSON.stringify(body);
    }
  };
  return {
    statusCode,
    body,
    headers
  };
}
