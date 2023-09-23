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
  // "Access-Control-Allow-Origin": "https://warrant-entry.vercel.app",
  "Access-Control-Allow-Origin": "*",
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
  let payload;
  switch (requestEndPoint) {
    case "saveComment":
      payload = {
        TableName: dynamodbTableName,
        Item: {
          id: AWS.util.uuid.v4(),
          user_name: requestParams.user_name,
          comment: requestParams.comment,
          comment_date: requestParams.comment_date,
          comment_time: requestParams.comment_time,
        },
      };
      try {
        // note: scan is working but put is not working
        // const data = await docClient.scan(params).promise();
        const data = await docClient.put(payload).promise();
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

    case "modifyComment":
      payload = {
        TableName: dynamodbTableName,
        Key: {
          id: requestParams.commentId,
        },
        UpdateExpression: `SET #comm = :value`,
        ExpressionAttributeValues: {
          ":value": requestParams.newComment,
        },
        ExpressionAttributeNames: {
          "#comm": "comment",
        },
        ReturnValues: "UPDATED_NEW",
      };
      try {
        await docClient.update(payload).promise();
        return {
          statusCode: 200,
          headers: requestHeader,
          body: "Successfully updated comment!",
        };
      } catch (err) {
        return {
          statusCode: 500,
          headers: requestHeader,
          body: { error: err },
        };
      }

    case "deleteComment":
      payload = {
        TableName: dynamodbTableName,
        Key: {
          id: requestParams.commentId,
        },
      };

      try {
        await docClient.update(payload).promise();
        return {
          statusCode: 200,
          headers: requestHeader,
          body: "Successfully delete comment!",
        };
      } catch (err) {
        return {
          statusCode: 500,
          headers: requestHeader,
          error: err,
        };
      }

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
