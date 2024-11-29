import type { Handler } from '@netlify/functions';
import { whatsappService } from '../../src/services/whatsappService';

export const handler: Handler = async (event) => {
  // Autoriser CORS pour Make.com
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Handle GET requests with a friendly message
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: `
        <html>
          <body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px;">
            <h1>WhatsApp Webhook Endpoint</h1>
            <p>This is a webhook endpoint for receiving WhatsApp messages. It only accepts POST requests with JSON data.</p>
            <h2>Usage:</h2>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
POST /.netlify/functions/webhook
Content-Type: application/json

{
  "message": "Message content",
  "sender": "Sender ID",
  "timestamp": "2024-02-23T12:00:00Z"
}
            </pre>
          </body>
        </html>
      `
    };
  }

  // Only allow POST requests for actual webhook handling
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  }

  try {
    console.log('Received webhook:', event.body);
    const body = JSON.parse(event.body || '{}');
    const { message, sender, timestamp } = body;

    // Validate required fields
    if (!message || !sender) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      };
    }

    // Process the message
    const response = await whatsappService.handleIncomingMessage({
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(timestamp || Date.now()),
      sender
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  }
}