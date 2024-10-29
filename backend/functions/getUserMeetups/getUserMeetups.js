//root/backend/functions/getUserMeetups/index.js

const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const { username } = event.pathParameters || {};

    // Kontrollera om användarnamn har skickats med
    if (!username) {
      return sendError(400, 'Användarnamn är obligatoriskt');
    }

    // Hämta alla meetups där användaren har registrerat sig
    const queryParams = {
      TableName: 'MeetupTable',
      IndexName: 'AttendingIndex',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username,
      },
    };

    const result = await db.send(new QueryCommand(queryParams));

    if (!result.Items || result.Items.length === 0) {
      return sendResponse({
        message: 'Inga meetups hittades för denna användare',
        meetups: [],
      });
    }

    // Returnera de anmälda och eventuellt tidigare meetups för användaren
    return sendResponse({
      message: 'Användarens meetups hämtades framgångsrikt',
      meetups: result.Items,
    });
  } catch (error) {
    console.error('Fel vid hämtning av användarens meetups:', error);
    return sendError(500, 'Internt serverfel');
  }
};
