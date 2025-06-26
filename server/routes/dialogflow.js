const express = require('express');
const router = express.Router();
const dialogflow = require('@google-cloud/dialogflow');
const { dialogflowConfig } = require('../config/dialogflow');

// Create a new session client
const sessionClient = new dialogflow.SessionsClient({
  credentials: dialogflowConfig.credentials
});

router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    // Create session path
    const sessionPath = sessionClient.projectAgentSessionPath(
      dialogflowConfig.projectId,
      sessionId
    );

    // Create request
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    // Send request to Dialogflow
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({
      text: result.fulfillmentText,
      intent: result.intent.displayName,
      confidence: result.intentDetectionConfidence
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

module.exports = router; 