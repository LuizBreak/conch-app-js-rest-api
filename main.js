'use strict';

// Instructions: This function serves as a engine to run tests
//               against DynamoDB locally with having to deploy
//               lambda
//               Command: node main.js

const AWS = require("aws-sdk")
AWS.config.update({region:'us-east-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient()

dynamoDB
  .scan({
    TableName: "sersalud-resources-DEV",
  })
  .promise()
  .then(data => console.log(data))
  .catch(console.error)