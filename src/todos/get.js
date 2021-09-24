'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// test case 1 -> ERROR	ValidationException: The provided key element does not match the schema

module.exports.get = (event, context, callback) => {

  const { id } = event.pathParameters;

  const params = {
    TableName: "conch-transactions-DEV",
    Key: {
      "fromUser": id
    }
  };

  // fetch unique transaction from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the transaction item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};