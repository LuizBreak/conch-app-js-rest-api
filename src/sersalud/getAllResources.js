'use strict';

const AWS = require('aws-sdk'); 

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: "sersalud-resources-DEV",
};

module.exports.getAllResources = (event, context, callback) => {
  // fetch all trasactions in this table
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the nomina records.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};