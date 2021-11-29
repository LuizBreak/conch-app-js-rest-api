/*
  Article reference: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html#http-api-dynamo-db-create-table
*/

const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

// TODO: Investigate how to use it later
const crypto = require("crypto");
// Generate unique id with no external dependencies
const generateUUID = () => crypto.randomBytes(16).toString("hex");


module.exports.createNominaEntry = async (event, context) => {

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
      case "DELETE /entries/{timestamp}":
        await dynamo
          .delete({
            TableName: "sersalud-nomina-bkp-DEV",
            Key: {
              timestamp: Number(event.pathParameters.timestamp)
            }
          })
          .promise();
        body = `Deleted entry ${event.pathParameters.timestamp}`;
        break;
      case "PUT /entries":
        // let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "sersalud-nomina-bkp-DEV",
            Item: {
                timestamp: requestJSON.timestamp,
                nombre: requestJSON.nombre,
                otrosPagos: requestJSON.otrosPagos,
                horaAlmuerzo: requestJSON.horaAlmuerzo,
                diasCobertura: requestJSON.diasCobertura,
                horaSalida: requestJSON.horaSalida,
                cargoDelSolicitante: requestJSON.cargoDelSolicitante,
                concepto: requestJSON.concepto,
                evidencia: requestJSON.evidencia,
                montosNegociados: requestJSON.montosNegociados,
                comentarios: requestJSON.comentarios,
                supervisor: requestJSON.supervisor,
                localidad: requestJSON.localidad,
                horaEntrada: requestJSON.horaEntrada,
                mesCobertura: requestJSON.mesCobertura,
                cedula: requestJSON.cedula
            }
          })
          .promise();
        body = `Put (updated) item ${requestJSON.timestamp}`;
        break;
      case "POST /entries":
        if (!requestJSON.hasOwnProperty('timestamp')) {
          requestJSON.timestamp = Date.now();
        }
        // requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "sersalud-nomina-bkp-DEV",
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
        body = `Post (inserted) item ${requestJSON.timestamp}`;
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
