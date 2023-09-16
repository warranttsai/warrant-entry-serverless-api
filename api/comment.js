"use strict";
// import {
//   getComment,
//   saveComment,
//   modifyComment,
//   deleteComment,
// } from "../controllers/commentController";

module.exports.handler = async (event) => {
  const requestEvent = JSON.stringify(event);
  console.log(`Request event: ${requestEvent}`);
  const jsonRequestEvent = JSON.parse(requestEvent);
  const endPoint = jsonRequestEvent.endpoint;
  console.log(`endpoint: ${endPoint}`);

  let response;
  switch (endPoint) {
    case "getComment":
      const userId = jsonRequestEvent.params.userId;
      console.log("userId", userId);
      //   response = await getComment(userId);
      break;
    case "saveComment":
      // const userName = jsonRequestEvent.params.userId;
      // const date = jsonRequestEvent.params.userId;
      // const time = jsonRequestEvent.params.time;
      // const comment = jsonRequestEvent.params.comment;
      //   response = await saveComment(userId);
      break;
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
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
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
