/*
  Article reference: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html#http-api-dynamo-db-create-table
*/

const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

// TODO: Investigate how to use it later
const crypto = require("crypto");
// Generate unique id with no external dependencies
const generateUUID = () => crypto.randomBytes(16).toString("hex");


module.exports.createTransactions = async (event, context) => {

  var timestamp = new Date().getTime();
  let body;
  let statusCode = 200;
  
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    let requestJSON = JSON.parse(event.body);

    switch (event.routeKey) {
      case "DELETE /items/{id}":
        await dynamo
          .delete({
            TableName: "conch-transactions-DEV",
            Key: {
              timestamp: event.pathParameters.timestamp
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.timestamp}`;
        break;
      case "PUT /items":
        // let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "conch-transactions-DEV",
            Item: {
                timestamp: timestamp,
                fromUser: requestJSON.fromUser,
                toUser: requestJSON.toUser,
                amount: requestJSON.amount,
                type: requestJSON.type,
                transactionDate: requestJSON.transactionDate,
                transactionType: requestJSON.transactionType,
                userId: requestJSON.userId,
                locationName: requestJSON.locationName,
                longitude: requestJSON.longitude,
                latitude: requestJSON.latitude
            }
          })
          .promise();
        body = `Put item ${requestJSON.timestamp}`;
        break;
      case "POST /items":
        // requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "conch-transactions-DEV",
            Item: {
                timestamp: timestamp,
                fromUser: requestJSON.fromUser,
                toUser: requestJSON.toUser,
                amount: requestJSON.amount,
                type: requestJSON.type,
                transactionDate: requestJSON.transactionDate,
                transactionType: requestJSON.transactionType,
                userId: requestJSON.userId,
                locationName: requestJSON.locationName,
                longitude: requestJSON.longitude,
                latitude: requestJSON.latitude
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
