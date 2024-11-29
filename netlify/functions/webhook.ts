require('dotenv').config();

import type { Handler } from '@netlify/functions';
import { aiService } from '../../src/services/aiService';
import { whatsappService } from '../../src/services/whatsappService';

// Configuration pour les fonctions
const config = {
  openai: {
    apiKey: process.env.VITE_OPENAI_API_KEY || '',
  },
  airtable: {
    apiKey: process.env.VITE_AIRTABLE_API_KEY || '',
    baseId: process.env.VITE_AIRTABLE_BASE_ID || '',
  },
  make: {
    webhookUrl: process.env.VITE_MAKE_WEBHOOK_URL || '',
    webhookSecret: process.env.MAKE_WEBHOOK_SECRET || '',
  },
};

export const handler: Handler = async (event) => {
  // Autoriser CORS
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
};