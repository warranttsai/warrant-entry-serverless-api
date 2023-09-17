"use strict";
import { getComments } from "../controllers/commentsController";
import { buildResponse } from "../utils/generalUtils";

module.exports.handler = async (event) => {
  const requestEvent = JSON.stringify(event);
  console.log(`Request event: ${requestEvent}`);
  const jsonRequestEvent = JSON.parse(requestEvent);

  let response;
  let params;
  switch (jsonRequestEvent.endpoint) {
    case "getComments":
      params = {
        TableName: "visitorComments",
      };
      try {
        const data = await docClient.scan(params).promise();
        return { body: JSON.stringify(data) };
      } catch (err) {
        return { error: err };
      }

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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
