import { buildResponse } from "../utils/generalUtils";

const dynamodbTableName = "visitorComments";

export async function getComment(commentId) {
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
export async function saveComment(username, date, time) {
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
export async function modifyComment(id, updateKey, updateValue) {
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
export async function deleteComment(commentId) {
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
