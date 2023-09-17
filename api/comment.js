"use strict";
// import {
//   getComment,
//   saveComment,
//   modifyComment,
//   deleteComment,
// } from "../controllers/commentController";
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const dynamodbTableName = "visitorComments";
  const requestEvent = JSON.stringify(event);
  console.log(`Request event: ${requestEvent}`);
  const jsonRequestEvent = JSON.parse(requestEvent);
  const endPoint = jsonRequestEvent.endpoint;
  console.log(`endpoint: ${endPoint}`);

  let response;
  let params;
  switch (endPoint) {
    case "getCommentByUserId":
      params = {
        TableName: dynamodbTableName,
        Item: {
          user_id: jsonRequestEvent.params.userId,
        },
      };
      try {
        const data = await docClient.get(params).promise();
        return { body: JSON.stringify(data) };
      } catch (err) {
        return { error: err };
      }

    case "saveComment":
      params = {
        TableName: dynamodbTableName,
        Item: {
          id: AWS.util.uuid.v4(),
          user_id: jsonRequestEvent.params.userId,
          comment: jsonRequestEvent.params.comment,
          comment_date: jsonRequestEvent.params.comment_date,
          comment_time: jsonRequestEvent.params.comment_time,
        },
      };
      try {
        await docClient.put(params).promise();
        return { body: "Successfully created item!" };
      } catch (err) {
        return { error: err };
      }

    case "modifyComment":
      params = {
        TableName: dynamodbTableName,
        Key: {
          id: jsonRequestEvent.params.commentId,
        },
        UpdateExpression: `SET comment = :value`,
        ExpressionAttributeValues: {
          ":value": jsonRequestEvent.params.newComment,
        },
        ReturnValues: "UPDATED_NEW",
      };
      try {
        await docClient.send(params).promise();
        return { body: "Successfully updated item!" };
      } catch (err) {
        return { error: err };
      }

    case "deleteComment":
      params = {
        TableName: dynamodbTableName,
        Key: {
          id: jsonRequestEvent.params.commentId,
        },
        ReturnValues: NONE | ALL_OLD | UPDATED_OLD | ALL_NEW | UPDATED_NEW,
      };
      try {
        const data = await docClient.delete(params).promise();
        return { body: JSON.stringify(data) };
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
