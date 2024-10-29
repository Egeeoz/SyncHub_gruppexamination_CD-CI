// path: root/backend/functions/userLogin/index.js

const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  // Validate input
  if (!username || !password) {
    return sendError(400, 'Username and Password are required');
  }

  try {
    // Define parameters to search for the user by username
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

    // Execute the scan command
    const scanCommand = new ScanCommand(scanParams);
    const result = await db.send(scanCommand);

    // Check if the username exists
    if (!result.Items || result.Items.length === 0) {
      return sendError(404, 'User not found');
    }

    // Verify the password
    if (!password) {
      return sendError(401, 'Incorrect password');
    }

    // Successful login
    return sendResponse('Login successful');
  } catch (error) {
    return sendError(500, 'Internal server error');
  }
};
