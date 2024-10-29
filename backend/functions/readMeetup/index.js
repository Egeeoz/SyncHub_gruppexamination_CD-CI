// path: root/backend/functions/readMeetup/readMeetup.js

const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    // Extract meetup ID from the query parameters
    const id = event?.pathParameters?.id;

    // Validate the ID
    if (!id) {
      return sendError(400, 'Valid Meetup ID is required');
    }

    // Define parameters to get the meetup by ID
    const getParams = {
      TableName: 'MeetupTable',
      Key: { id },
    };

    // Execute the GetCommand to fetch the meetup details
    const { Item: meetup } = await db.send(new GetCommand(getParams));

    // Check if the meetup exists
    if (!meetup) {
      return sendError(404, 'Meetup not found');
    }

    // Return the meetup details with a 200 status code
    return sendResponse(meetup);
  } catch (error) {
    console.error('Error reading meetup:', { error, event });
    return sendError(500, 'Internal server error');
  }
};
