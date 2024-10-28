const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { v4: uuidv4 } = require('uuid');
const { ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  if (!username || !password) {
    return sendError(400, 'Username and Password are required');
  }

  try {
    const scanParams = {
      TableName: 'UserTable',
      FilterExpression: '#username = :username',
      ExpressionAttributeNames: {
        '#username': 'username',
      },
      ExpressionAttributeValues: {
        ':username': username,
      },
    };

    const scanCommand = new ScanCommand(scanParams);
    const result = await db.send(scanCommand);

    if (result.Items && result.Items.length > 0) {
      return sendError(403, 'Username already exists, pick another Username');
    }

    const userId = uuidv4();

    const putParams = {
      TableName: 'UserTable',
      Item: {
        id: userId,
        username: username,
        password: password,
      },
    };

    const putCommand = new PutCommand(putParams);
    await db.send(putCommand);

    return sendResponse(201, 'User successfully created');
  } catch (error) {
    console.error(error);
    return sendError(500, 'Internal server error');
  }
};
