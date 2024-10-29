// path: root/backend/functions/attendMeetup/attendMeetup.js

const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const { meetupId, username } = JSON.parse(event.body);

    // Validate required fields
    if (!meetupId || !username) {
      return sendError(400, 'Meetup and user name are required');
    }

    // First, get the current meetup data
    const getParams = {
      TableName: 'MeetupTable',
      Key: {
        id: meetupId,
      },
    };

    const { Item: meetup } = await db.send(new GetCommand(getParams));

    if (!meetup) {
      return sendError(404, 'Meeting not found');
    }

    // Check if user is already attending
    const attending = meetup.attending || [];
    const isAttending = attending.includes(username);

    let updateParams;
    let message;

    if (isAttending) {
      // Remove user from attending list
      updateParams = {
        TableName: 'MeetupTable',
        Key: {
          id: meetupId,
        },
        UpdateExpression:
          'SET attending = :newAttending, attendingCount = attendingCount - :decrement',
        ExpressionAttributeValues: {
          ':newAttending': attending.filter((name) => name !== username),
          ':decrement': 1,
        },
        ReturnValues: 'ALL_NEW',
      };
      message = 'Successfully unregistered attendance';
    } else {
      // Add user to attending list
      updateParams = {
        TableName: 'MeetupTable',
        Key: {
          id: meetupId,
        },
        UpdateExpression:
          'SET attending = list_append(if_not_exists(attending, :empty_list), :new_attendee), attendingCount = if_not_exists(attendingCount, :zero) + :increment',
        ExpressionAttributeValues: {
          ':empty_list': [],
          ':new_attendee': [username],
          ':zero': 0,
          ':increment': 1,
        },
        ReturnValues: 'ALL_NEW',
      };
      message = 'Successfully registered attendance';
    }

    const result = await db.send(new UpdateCommand(updateParams));

    return sendResponse({
      message,
      meetup: result.Attributes,
    });
  } catch (error) {
    console.error('Error updating attendance:', error);

    return sendError(500, 'Internal server error');
  }
};
