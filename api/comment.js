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
  const requestEvent = JSON.stringify(event);
  console.log(`Request event: ${requestEvent}`);
  const jsonRequestEvent = JSON.parse(requestEvent);
  const endPoint = jsonRequestEvent.endpoint;
  console.log(`endpoint: ${endPoint}`);

  let response;
  switch (endPoint) {
    case "getComment":
      console.log("userId", jsonRequestEvent.params.userId);
      //   response = await getComment(userId);
      break;
    case "saveComment":
      const params = {
        TableName: "visitorComments",
        Item: {
          id: "13123123",
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
      //   response = await modifyComment(userId);
      break;
    case "getComment":
      //   const userId = jsonRequestEvent.params.userId;
      //   response = await getComment(userId);
      break;

    default:
      response = buildResponse(404, "404 Not Found");
  }

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
};

async function getComment(commentId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: commentId,
    },
  };
  return await dynamodb
    .get(params)
    .promise()
    .then(
      (res) => {
        return buildResponse(200, res.item);
      },
      (err) => {
        console.log(`Error happended while getting comment. ${err}`);
      }
    );
}
function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}
