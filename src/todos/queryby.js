const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const dynamoDB = new AWS.DynamoDB();

module.exports.queryby = async (event) => {
    
  // test case 1: PASSED -> const fuser = "source-user";
  // test case 2: PASSED -> const fuser = "source-";
  // test case 3: ????   -> const { fromUser } = event.pathParameters;

    const { fromUser } = event.pathParameters;

    const params = {
        TableName : "conch-transactions-DEV",
        ProjectionExpression:"#timestamp, fromUser, locationName, amount",
        KeyConditionExpression: "fromUser = :fuser ",
        ExpressionAttributeNames:{
            "#timestamp": "ts"
        },
        ExpressionAttributeValues: {
            ":fuser": fromUser,
        }
    };

    const results = await documentClient.query(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(results),
    };
    return response;
};