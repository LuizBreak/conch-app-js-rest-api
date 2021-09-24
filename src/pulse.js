"use strict";

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