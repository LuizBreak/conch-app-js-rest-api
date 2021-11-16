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
    let requestJSON = JSON.parse(event.body);

    switch (event.routeKey) {
      case "DELETE /entries/{id}":
        await dynamo
          .delete({
            TableName: "sersalud-nomina-bkp-DEV",
            Key: {
              timestamp: event.pathParameters.timestamp
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
                timestamp: timestamp,
                nombre: requestJSON.nombre,
                Localidad: requestJSON.Localidad,
                personaCubierta: requestJSON.personaCubierta,
                evidencia: requestJSON.type,
                concepto: requestJSON.transactionDate,
                fecha: requestJSON.transactionType,
                cedula: requestJSON.userId
            }
          })
          .promise();
        body = `Put entry ${requestJSON.timestamp}`;
        break;
      case "POST /entries":
        // requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "sersalud-nomina-bkp-DEV",
            Item: {
              timestamp: timestamp,
              nombre: requestJSON.nombre,
              Localidad: requestJSON.Localidad,
              personaCubierta: requestJSON.personaCubierta,
              evidencia: requestJSON.type,
              concepto: requestJSON.transactionDate,
              fecha: requestJSON.transactionType,
              cedula: requestJSON.userId
            }
          })
          .promise();
        body = `Post item ${requestJSON.timestamp}`;
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
