const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const { date, location, category } = event.queryStringParameters || {};

    // Bygg filteruttrycket dynamiskt baserat på angivna filterparametrar
    let filterExpression = '';
    const expressionAttributeValues = {};

    if (date) {
      filterExpression += 'date = :date ';
      expressionAttributeValues[':date'] = date;
    }

    if (location) {
      if (filterExpression) filterExpression += 'AND ';
      filterExpression += 'location = :location ';
      expressionAttributeValues[':location'] = location;
    }

    if (category) {
      if (filterExpression) filterExpression += 'AND ';
      filterExpression += 'category = :category ';
      expressionAttributeValues[':category'] = category;
    }

    const scanParams = {
      TableName: 'MeetupTable',
      FilterExpression: filterExpression || undefined,
      ExpressionAttributeValues: Object.keys(expressionAttributeValues).length
        ? expressionAttributeValues
        : undefined,
    };

    const result = await db.send(new ScanCommand(scanParams));

    return sendResponse({
      message: 'Meetups filtrerades framgångsrikt',
      meetups: result.Items,
    });
  } catch (error) {
    console.error('Fel vid filtrering av meetups:', error);
    return sendError(500, 'Internt serverfel');
  }
};
