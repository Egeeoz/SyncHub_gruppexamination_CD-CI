//root/backend/functions/getUserMeetups/index.js

const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const { username } = event.pathParameters || {};

    // Check if username is provided
    if (!username) {
      return sendError(400, 'Användarnamn är obligatoriskt');
    }

    // Scan for all meetups, then filter to those where the user is attending
    const scanParams = {
      TableName: 'MeetupTable',
      FilterExpression: 'contains(attending, :username)',
      ExpressionAttributeValues: {
        ':username': username,
      },
    };

    const result = await db.send(new ScanCommand(scanParams));

    if (!result.Items || result.Items.length === 0) {
      return sendResponse({
        message: 'Inga meetups hittades för denna användare',
        meetups: [],
      });
    }

    // Return the meetups the user is attending
    return sendResponse({
      message: 'Användarens meetups hämtades framgångsrikt',
      meetups: result.Items,
    });
  } catch (error) {
    console.error('Fel vid hämtning av användarens meetups:', error);
    return sendError(500, 'Internt serverfel');
  }
};
