const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Validate AWS region environment variable
if (!process.env.AWS_REGION) {
  throw new Error('AWS_REGION environment variable is not set.');
}

// Create and configure DynamoDB client
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

// Initialize DynamoDB Document Client
const db = DynamoDBDocumentClient.from(dynamoDBClient);

module.exports = { db };
