// path: root/backend/functions/deleteMeetup/deleteMeetup.js

const { db } = require('../../services/db');
const { DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { sendResponse, sendError } = require('../../utils/sendResponse');

exports.handler = async (event) => {
  try {
    const { id, creatorId } = JSON.parse(event.body);

    if (!id || !creatorId) {
      return sendError(400, 'Missing meetup ID or creator ID');
    }

    // Retrieve the meetup to confirm it exists and check creator ID
    const getParams = {
      TableName: 'MeetupTable',
      Key: { id },
    };

    const result = await db.send(new GetCommand(getParams));

    if (!result.Item) {
      return sendError(404, 'Meetup not found');
    }

    if (result.Item.creatorId !== creatorId) {
      return sendError(
        403,
        'Unauthorized: Only the creator can delete this meetup'
      );
    }

    // Delete the meetup if the creator ID matches
    const deleteParams = {
      TableName: 'MeetupTable',
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
    };

    await db.send(new DeleteCommand(deleteParams));

    return sendResponse(200, 'Meetup deleted successfully');
  } catch (error) {
    console.error('Error deleting meetup:', error);

    // Specific error handling based on AWS error codes
    if (error.name === 'ConditionalCheckFailedException') {
      return sendError(404, 'Meetup not found or already deleted');
    }

    return sendError(500, 'Internal server error');
  }
};
