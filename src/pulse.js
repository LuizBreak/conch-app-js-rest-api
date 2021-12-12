"use strict";

// Instructions: This function serves as a engine to run tests
//               against DynamoDB locally with having to deploy
//               lambda
//               Command: node main.js

module.exports.pulse = async (event) => {

  var timestamp = new Date().getTime();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless! our API is alive! v1.0",
        input: event,
      },
      null,
      2
    ),
  };
};