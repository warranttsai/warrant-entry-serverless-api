"use strict";
import { getComments } from "../controllers/commentsController";
import { buildResponse } from "../utils/generalUtils";

module.exports.handler = async (event) => {
  const requestEvent = JSON.stringify(event);
  console.log(`Request event: ${requestEvent}`);
  const jsonRequestEvent = JSON.parse(requestEvent);

  let response;
  switch (jsonRequestEvent.endpoint) {
    case "getComments":
      const userId = jsonRequestEvent.params.userId;
      response = await getComments(userId);
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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
