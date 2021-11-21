/*
  Article reference: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html#http-api-dynamo-db-create-table
*/

const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

// TODO: Investigate how to use it later
const crypto = require("crypto");
// Generate unique id with no external dependencies
const generateUUID = () => crypto.randomBytes(16).toString("hex");


module.exports.createResourceEntry = async (event, context) => {

  var timestamp = new Date().getTime();
  let body;
  let statusCode = 200;
  
  const headers = {
    "Content-Type": "application/json"
  };

  try {

    let requestJSON = {};
    if(event.body) {
      requestJSON = JSON.parse(event.body);
    }
    
    switch (event.routeKey) {
      case "DELETE /entries/{nombre}":
        await dynamo
          .delete({
            TableName: "sersalud-resources-DEV",
            Key: {
              timestamp: Number(event.pathParameters.nombre)
            }
          })
          .promise();
        body = `Deleted entry ${event.pathParameters.nombre}`;
        break;
      case "PUT /entries":
        // let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "sersalud-resources-DEV",
            Item: {
                timestamp: requestJSON.timestamp,
                nombre: requestJSON.nombre,
                cedula: requestJSON.cedula,
                cargo: requestJSON.cargo
            }
          })
          .promise();
        body = `Put (updated) item ${requestJSON.nombre}`;
        break;
      case "POST /entries":
        // requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "sersalud-resources-DEV",
            Item: {
                timestamp: requestJSON.timestamp,
                nombre: requestJSON.nombre,
                Localidad: requestJSON.Localidad,
                personaCubierta: requestJSON.personaCubierta,
                evidencia: requestJSON.evidencia,
                concepto: requestJSON.concepto,
                diasCobertura: requestJSON.diasCobertura,
                mesCobertura: requestJSON.mesCobertura,
                cedula: requestJSON.cedula,
                supervisor: requestJSON.supervisor,
                horaEntrada: requestJSON.horaEntrada,
                horaSalida: requestJSON.horaSalida,
                horaAlmuerzo: requestJSON.horaAlmuerzo,
                montosNegociados: requestJSON.montosNegociados,
                comentariosAdicionales: requestJSON.comentariosAdicionales
            }
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

  return {
    statusCode,
    body,
    headers
  };
};

// module.export = {
//     handler: createTransactions
// };
