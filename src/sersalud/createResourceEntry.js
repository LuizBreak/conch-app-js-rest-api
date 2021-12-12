/*
  Article reference: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html#http-api-dynamo-db-create-table
*/

const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

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
      case "DELETE /resources/{timestamp}":
        await dynamo
          .delete({
            TableName: "sersalud-resources-DEV",
            Key: {
              timestamp: Number(event.pathParameters.timestamp)
            }
          })
          .promise();
        body = `Deleted entry ${event.pathParameters.timestamp}`;
        break;
      case "PUT /resources":
        if (!requestJSON.hasOwnProperty('timestamp') || 
             requestJSON.timestamp == 0 || 
             requestJSON.timestamp == "")   {
          requestJSON.timestamp = Date.now();
        }
        await dynamo
          .put({
            TableName: "sersalud-resources-DEV",
            Item: {
                timestamp: Number(requestJSON.timestamp),
                nombre: requestJSON.nombre,
                apellido: requestJSON.apellido,
                cedula: requestJSON.cedula,
                cargo: requestJSON.cargo,
                telefono: requestJSON.telefono,
                correo: requestJSON.correo,
                banco: requestJSON.banco,
                tipoDeCuenta: requestJSON.tipoDeCuenta,
                cuenta: requestJSON.cuenta,
                tipoDePago: requestJSON.tipoDePago,
                estado: requestJSON.estado,
                direccion: requestJSON.direccion,
                comentario: requestJSON.comentario,
                fechaDeInicio: requestJSON.fechaDeInicio,
                exequatur: requestJSON.exequatur            
              }
          })
          .promise();
        body = `Put (updated) item ${requestJSON.nombre}`;
        break;
      case "POST /resources":
        // requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "sersalud-resources-DEV",
            Item: {
                timestamp: Date.now(),
                nombre: requestJSON.nombre,
                apellido: requestJSON.apellido,
                cedula: requestJSON.cedula,
                cargo: requestJSON.cargo,
                telefono: requestJSON.telefono,
                correo: requestJSON.correo,
                banco: requestJSON.banco,
                tipoDeCuenta: requestJSON.tipoDeCuenta,
                cuenta: requestJSON.cuenta,
                tipoDePago: requestJSON.tipoDePago,
                estado: requestJSON.estado,
                direccion: requestJSON.direccion,
                comentario: requestJSON.comentario,
                fechaDeInicio: requestJSON.fechaDeInicio,
                exequatur: requestJSON.exequatur
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
