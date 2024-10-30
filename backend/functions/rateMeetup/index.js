const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const { meetupId, username, rating, review } = JSON.parse(event.body);

    // Kontrollera obligatoriska fält
    if (!meetupId || !username || !rating) {
      return sendError(400, 'Meetup ID, användarnamn och betyg krävs');
    }

    // Hämta nuvarande meetup-data
    const getParams = {
      TableName: 'MeetupTable',
      Key: {
        id: meetupId,
      },
    };

    const { Item: meetup } = await db.send(new GetCommand(getParams));

    if (!meetup) {
      return sendError(404, 'Meetup hittades inte');
    }

    // Hantera recension och betyg
    const reviews = meetup.reviews || [];
    const existingReviewIndex = reviews.findIndex(
      (r) => r.username === username
    );

    if (existingReviewIndex >= 0) {
      // Uppdatera befintlig recension
      reviews[existingReviewIndex] = { username, rating, review };
    } else {
      // Lägg till ny recension
      reviews.push({ username, rating, review });
    }

    // Uppdatera meetup med nya recensioner
    const updateParams = {
      TableName: 'MeetupTable',
      Key: {
        id: meetupId,
      },
      UpdateExpression: 'SET reviews = :reviews',
      ExpressionAttributeValues: {
        ':reviews': reviews,
      },
      ReturnValues: 'ALL_NEW',
    };

    const result = await db.send(new UpdateCommand(updateParams));

    return sendResponse({
      message: 'Recension och betyg har sparats',
      meetup: result.Attributes,
    });
  } catch (error) {
    console.error('Fel vid betygsättning och recension:', error);
    return sendError(500, 'Internt serverfel');
  }
};
