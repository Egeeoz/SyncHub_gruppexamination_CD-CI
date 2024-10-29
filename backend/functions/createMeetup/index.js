// path: root/backend/functions/createMeetup/createMeetup.js

// const { sendResponse, sendError } = require('../../utils/sendResponse');
// const { db } = require('../../services/db');
// const { PutCommand } = require('@aws-sdk/lib-dynamodb');
// const { v4: uuidv4 } = require('uuid');

// exports.handler = async (event) => {
//   try {
//     const { title, date, location, description, organizerName, creatorId } =
//       JSON.parse(event.body);

//     // Validate required fields
//     if (!title || !date || !location || !organizerName || !creatorId) {
//       return sendError(
//         400,
//         'Title, date, location, organizer name, and creator ID are required'
//       );
//     }

//     // Generate a unique meeting ID
//     const meetingId = uuidv4();

//     // Define parameters for the PutCommand
//     const putParams = {
//       TableName: 'MeetupTable',
//       Item: {
//         id: meetingId,
//         title,
//         date,
//         location,
//         description: description || '',
//         organizerName,
//         attending: [],
//         attendingCount: 0,
//         creatorId, // store creator ID for verification
//         createdAt: new Date().toISOString(),
//       },
//       ConditionExpression: 'attribute_not_exists(id)',
//     };

//     // Execute the put command
//     await db.send(new PutCommand(putParams));

//     // Successful creation
//     return sendResponse(putParams.Item);
//   } catch (error) {
//     console.error('Error creating meeting:', error);

//     // Specific error handling based on AWS error codes
//     if (error.name === 'ConditionalCheckFailedException') {
//       return sendError(409, 'Meeting ID already exists');
//     }

//     return sendError(500, 'Internal server error');
//   }
// };

const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  try {
    const {
      title,
      date,
      location,
      description,
      organizerName,
      creatorId,
      maxAttendees,
    } = JSON.parse(event.body);

    // Kontrollera obligatoriska fält
    if (!title || !date || !location || !organizerName || !creatorId) {
      return sendError(
        400,
        'Titel, datum, plats, arrangörsnamn och skapare-ID krävs'
      );
    }

    // Generera ett unikt meetup-ID
    const meetingId = uuidv4();

    // Definiera parametrar för att skapa meetupen
    const putParams = {
      TableName: 'MeetupTable',
      Item: {
        id: meetingId,
        title,
        date,
        location,
        description: description || '',
        organizerName,
        attending: [],
        attendingCount: 0,
        maxAttendees: maxAttendees || 20, // Standardvärde om inget annat anges
        creatorId,
        createdAt: new Date().toISOString(),
      },
      ConditionExpression: 'attribute_not_exists(id)',
    };

    // Skapa meetup
    await db.send(new PutCommand(putParams));

    // Återge framgångsrikt skapande
    return sendResponse(putParams.Item);
  } catch (error) {
    console.error('Fel vid skapandet av meetup:', error);

    if (error.name === 'ConditionalCheckFailedException') {
      return sendError(409, 'Meetup-ID finns redan');
    }

    return sendError(500, 'Internt serverfel');
  }
};
