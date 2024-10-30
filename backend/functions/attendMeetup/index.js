// path: root/backend/functions/attendMeetup/index.js

const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const { meetupId, username } = JSON.parse(event.body);

    // Kontrollera obligatoriska fält
    if (!meetupId || !username) {
      return sendError(400, 'Meetup ID och användarnamn krävs');
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

    // Kontrollera om max antal deltagare har uppnåtts
    const maxAttendees = meetup.maxAttendees || 20; // Definiera ett maxantal, t.ex. 20, om det inte är angivet
    const attendingCount = meetup.attendingCount || 0;

    if (attendingCount >= maxAttendees) {
      return sendError(400, 'Meetup är full, inga fler deltagare kan anmälas');
    }

    // Kontrollera om användaren redan deltar
    const attending = meetup.attending || [];
    const isAttending = attending.includes(username);

    let updateParams;
    let message;

    if (isAttending) {
      // Ta bort användaren från deltagarlistan
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
      message = 'Avanmälan lyckades';
    } else {
      // Lägg till användaren i deltagarlistan
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
      message = 'Anmälan lyckades';
    }

    // Uppdatera meetup-data
    const result = await db.send(new UpdateCommand(updateParams));

    return sendResponse({
      message,
      meetup: result.Attributes,
    });
  } catch (error) {
    console.error('Fel vid uppdatering av deltagande:', error);
    return sendError(500, 'Internt serverfel');
  }
};
