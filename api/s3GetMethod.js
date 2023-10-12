"use strict";

const AWS = require("aws-sdk");
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const client = new S3Client({});
// The credential between aws-sdk v2 and v3 ahd been changed.
// const credentials = {
//   region: configuration.aws.region,
//   credentials: {
//     accessKeyId: configuration.aws.accessKeyId,
//     secretAccessKey: configuration.aws.secretAccessKey
//   }
// };
// AWS.config.update({
//   credentials:
// });
const s3 = new AWS.S3();
AWS.config.update({ region: "ap-southeast-2" });
const requestHeader = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

module.exports.handler = async (event) => {
  // Read parameters
  const requestParams = event.multiValueQueryStringParameters;
  const requestEndPoint =
    event.multiValueQueryStringParameters.endpoint[0].replace(/['"\[\]]/g, "");
  console.log({
    requestParams: requestParams,
    requestEndPoint: requestEndPoint,
  });

  let response;
  switch (requestEndPoint) {
    case "getS3BucketAllData":
      const bucketName = requestParams.bucketName[0].replace(/['"\[\]]/g, "");
      response = await getS3BucketAllData(bucketName);
      return response;

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

const getS3BucketAllData = async (bucketName) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: "Warrant.jpg",
  });
  try {
    const response = await client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();
    console.log(str);
    return {
      statusCode: 200,
      headers: requestHeader,
      body: JSON.stringify(str),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: requestHeader,
      body: JSON.stringify(err),
    };
  }
};
