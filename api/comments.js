"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
const docClient = new AWS.DynamoDB.DocumentClient();
// const requestHeader = {
//   "Access-Control-Allow-Headers": "Content-Type",
//   "Access-Control-Allow-Origin": "http://localhost:5000",
//   "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
// };
const requestHeader = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "https://warrant-entry.vercel.app",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

module.exports.handler = async (event) => {
  const dynamodbTableName = "visitorComments";
  const requestEvent = JSON.stringify(event);
  const jsonRequestEvent = JSON.parse(requestEvent);
  const requestBody = JSON.parse(jsonRequestEvent.body);
  const requestEndPoint = requestBody.endpoint;
  const requestParams = requestBody.params;
  console.log(`Request endpoint: ${requestEndPoint}`);
  console.log("requestParams:", requestParams);

  let response;
  let params;
  switch (requestEndPoint) {
    case "getComments":
      params = {
        TableName: dynamodbTableName,
      };
      try {
        const data = await docClient.scan(params).promise();
        return {
          statusCode: 200,
          headers: requestHeader,
          body: JSON.stringify(data),
        };
      } catch (err) {
        return {
          statusCode: 500,
          headers: requestHeader,
          body: { error: err },
        };
      }

    case "getCommentsByUserId":
      params = {
        TableName: dynamodbTableName,
        FilterExpression: "user_id = :user_id",
        ScanIndexForward: false, // true = ascending, false = descending
        ExpressionAttributeValues: {
          ":user_id": requestParams.userId,
        },
      };
      try {
        const data = await docClient.query(params).promise();
        return {
          statusCode: 200,
          headers: requestHeader,
          body: JSON.stringify(data),
        };
      } catch (err) {
        return {
          statusCode: 500,
          headers: requestHeader,
          body: { error: err },
        };
      }

    // default case
    default:
      return {
        statusCode: 404,
        headers: requestHeader,
        body: JSON.stringify(
          {
            message: "404 Not Found!",
            response: response,
          },
          null,
          2
        ),
      };
  }
};
