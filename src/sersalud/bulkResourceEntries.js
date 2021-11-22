const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.bulkResourceEntries = async (event, context) => {

  let body = "Response: ";
  let statusCode = 200;
  let action = "(updated)";

  
  const headers = {
    "Content-Type": "application/json"
  };

  let resourcesJSON = {};
  if(event.body) {
    resourcesJSON = JSON.parse(event.body);
  }

  for (i=0; i < resourcesJSON.length; i++){

    console.log(resourcesJSON[i] + "\n");

      try {

        let oneResource = resourcesJSON[i]
        
        switch (event.routeKey) {
          case "PUT /resources/bulk":

            if (!oneResource.hasOwnProperty('timestamp')) {
              oneResource.timestamp = new Date().getTime();
              action = "(inserted)";
            }

            await dynamo
              .put({
                TableName: "sersalud-resources-DEV",
                Item: oneResource 
              })
              .promise();
              body += `Put ${action} item ${oneResource.timestamp}\n`;
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
  };

  return {
    statusCode,
    body,
    headers
  };
}
