const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.bulkNominaEntries = async (event, context) => {

  let body = "Response: ";
  let statusCode = 200;
  let action = "(updated)";
  
  const headers = {
    "Content-Type": "application/json"
  };

  let nominaJSON = {};
  if(event.body) {
    nominaJSON = JSON.parse(event.body);
  }
  // json.forEach(function(obj) { console.log(obj.id); });

  for (i=0; i < nominaJSON.length; i++){

    console.log(nominaJSON[i] + "\n");

      try {

        let oneNominaEntry = nominaJSON[i]
        
        switch (event.routeKey) {

            case "PUT /nomina/bulk":

              if (!oneNominaEntry.hasOwnProperty('timestamp')) {
                oneNominaEntry.timestamp = new Date().getTime();
                action = "(inserted)";
              }
    
              await dynamo
                .put({
                  TableName: "sersalud-nomina-bkp-DEV",
                  Item: oneNominaEntry 
                })
                .promise();
              body += `Put ${action} item ${oneNominaEntry.timestamp}\n`;
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
