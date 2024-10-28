const { sendResponse, sendError } = require('../../utils/sendResponse');
const { db } = require('../../services/db');
const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');

exports.handler = async (event) => {
  try {
    const { meetupId, ...updateFields } = JSON.parse(event.body);

    // Validate input
    if (!meetupId) {
      return sendError(400, 'Meetup ID is required');
    }

    if (Object.keys(updateFields).length === 0) {
      return sendError(400, 'At least one field to update is required');
    }

    // Build the update expression dynamically based on provided fields
    let updateExpression = 'set ';
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateFields).forEach((field, index) => {
      const attributeName = `#field${index}`;
      const attributeValue = `:value${index}`;

      updateExpression += `${attributeName} = ${attributeValue}, `;
      expressionAttributeNames[attributeName] = field;
      expressionAttributeValues[attributeValue] = updateFields[field];
    });

    // Remove trailing comma and space from updateExpression
    updateExpression = updateExpression.slice(0, -2);

    // Define parameters for the UpdateCommand
    const updateParams = {
      TableName: 'MeetupTable',
      Key: { meetupId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    // Execute the update command
    const updateCommand = new UpdateCommand(updateParams);
    const result = await db.send(updateCommand);

    // Successful update
    return sendResponse('Meetup updated successfully', result.Attributes);
  } catch (error) {
    console.error('Error updating meetup:', error);
    return sendError(500, 'Internal server error');
  }
};
