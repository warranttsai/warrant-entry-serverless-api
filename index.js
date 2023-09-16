const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });

const dynamodb = new AWS.DynamoDB.DocumentClietn();
const dynamodbTableName = "visitorComments";
const healthPath = "/health";
const commentPath = "/comment";
const commentsPath = "/comments";

exports.handler = async function (event) {
  console.log(`Request event: ${event}`);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      response = buildResponse(200);
      break;
    case event.httpMethod === "GET" && event.path === commentPath:
      response = await getComment(event.queryStringParameters.id);
      break;
    case event.httpMethod === "GET" && event.path === commentsPath:
      response = await getComments();
      break;
    case event.httpMethod === "POST" && event.path === commentPath:
      response = await saveComment(JSON.parse(event.body));
      break;
    case event.httpMethod === "PATCH" && event.path === commentPath:
      const requestBody = JSON.parse(event.body);
      response = await modifyComment(
        requestBody.id,
        requestBody.updateKey,
        requestBody.updateValue
      );
      break;
    case event.httpMethod === "DELETE" && event.path === commentPath:
      response = await deleteComment(JSON.parse(event.body).id);
      break;

    default:
      response = buildResponse(404, "404 Not Found");
  }
  return response;
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
async function getComments(commentId) {
  const params = {
    TableName: dynamodbTableName,
  };
  const allComments = await scanDynamoRecords(params, []);
  const body = {
    comments: allComments,
  };

  return buildResponse(200, body);
}
async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch (err) {
    console.log(`Error happened while scanning dynamo DB records. ${err}`);
  }
}
async function saveComment(requestBody) {
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody,
  };
  return (
    await dynamodb
      .put(params)
      .promise()
      .then(() => {
        const body = {
          Operation: "SAVE",
          Message: "SUCCESS",
          Item: requestBody,
        };

        return buildResponse(200, body);
      }),
    (err) => {
      console.log(`Error happened while saving comment. ${err}`);
    }
  );
}
async function modifyComment(id, updateKey, updateValue) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: id,
    },
    UpdateExpression: `SET ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ":value": updateValue,
    },
    ReturnValues: "UPDATED_NEW",
  };

  return await dynamodb
    .update(params)
    .promise()
    .then(
      (res) => {
        const body = {
          Operation: "UPDATE",
          Message: "SUCCESS",
          Item: res,
        };

        return buildResponse(200, body);
      },
      (err) => {
        console.log(`Error happened while updating comment. ${err}`);
      }
    );
}
async function deleteComment(id) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: id,
    },
    ReturnValues: "ALL_OLD",
  };
  return await dynamodb
    .delete(params)
    .promise()
    .then(
      (res) => {
        const body = {
          Operation: "DELETE",
          Message: "SUCCESS",
          Item: res,
        };

        return buildResponse(200, body);
      },
      (err) => {
        console.log(`Error happened while deleting comment. ${err}`);
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
