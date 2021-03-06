/*
  Article reference: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html#http-api-dynamo-db-create-table
*/

const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();


module.exports.getAllTransactions = async (event, context) => {
  var timestamp = new Date().getTime();
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      case "GET /items/one/{fromUser}":
        body = await dynamo
          .get({
            TableName: "conch-transactions-DEV",
            Key: {
              "fromUser": event.pathParameters.fromUser
            }
          })
          .promise();
        break;
      case "GET /items/all":
        body = await dynamo.scan({ TableName: "conch-transactions-DEV" }).promise();
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
//     handler: getAllTransactions
// };
