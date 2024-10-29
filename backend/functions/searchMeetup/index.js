// path: root/backend/functions/searchMeetup/searchMeetup.js

const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const { keyword } = event.queryStringParameters || {};

    if (!keyword) {
      const scanParams = {
        TableName: 'MeetupTable',
        Limit: 20,
        ScanIndexForwad: false,
      };

      const result = await db.send(new ScanCommand(scanParams));
      return sendResponse(result.Items);
    }

    const searchParams = {
      TableName: 'MeetupTable',
    };

    const result = await db.send(new ScanCommand(searchParams));
    const lowercaseKeyword = keyword.toLowerCase();

    const filteredResults = result.Items.filter((item) => {
      // Case-insensitive exact matches for organizer, title, and location
      const organizerMatch = item.organizerName
        ?.toLowerCase()
        .includes(lowercaseKeyword);
      const titleMatch = item.title?.toLowerCase().includes(lowercaseKeyword);
      const locationMatch = item.location
        ?.toLowerCase()
        .includes(lowercaseKeyword);

      // Special handling for date field - check if any part of the date string matches
      const dateParts = item.date?.toLowerCase().split(/[\s-/]+/) || [];
      const dateMatch = dateParts.some(
        (part) =>
          part.includes(lowercaseKeyword) || // Part contains the keyword
          lowercaseKeyword.includes(part) || // Keyword contains the part
          // Check for partial number matches
          (part.match(/\d+/) &&
            lowercaseKeyword.match(/\d+/) &&
            part.includes(lowercaseKeyword))
      );

      return organizerMatch || titleMatch || locationMatch || dateMatch;
    });

    return sendResponse(filteredResults);
  } catch (error) {
    return sendError(500, 'Error performing search');
  }
};
