"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
const docClient = new AWS.DynamoDB.DocumentClient();

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
          user_id: requestParams.userId,
          comment: requestParams.comment,
          comment_date: requestParams.comment_date,
          comment_time: requestParams.comment_time,
        },
      };
      try {
        await docClient.put(payload).promise();
        return { body: "Successfully created item!" };
      } catch (err) {
        return { error: err };
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
        return { body: "Successfully updated item!" };
      } catch (err) {
        return { error: err };
      }

    case "deleteComment":
      payload = {
        TableName: dynamodbTableName,
        Key: {
          id: requestParams.commentId,
        },
      };
      try {
        await docClient.delete(payload).promise();
        return { body: "Successfully updated item!" };
      } catch (err) {
        return { error: err };
      }

    default:
      return {
        statusCode: 404,
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
