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
    case "sendingEmailToUser":
      params = {
        Destination: {
          ToAddresses: [requestParams.user_email],
        },
        Message: {
          Body: {
            Text: {
              Data: `
              *** This email was sent from an auto-notification system*** 

              Your name: ${requestParams.user_name}
              Your email: ${requestParams.user_email}
              Your feedback: ${requestParams.user_feedback}
              
              Feel free to reply directly to this email and Warrant will get it.

              Kindest regards, 
              Warrant TSAI
              `,
            },
          },
          Subject: {
            Data: "Thank you for the valuable feedback!",
          },
        },
        Source: "warrant1997@gmail.com",
      };
      const ses = new AWS.SES();
      // Create promise and SES service object
      try {
        const data = await ses.sendEmail(params).promise();
        return {
          statusCode: 200,
          headers: requestHeader,
          body: JSON.stringify(data),
        };
      } catch (err) {
        return { error: err };
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
