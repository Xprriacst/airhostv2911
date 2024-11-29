import axios from 'axios';
import type { Message } from '../types';
import { env } from '../config/env';
import { handleServiceError } from '../utils/error';

export const whatsappService = {
  async sendMessage(phoneNumber: string, message: string): Promise<void> {
    try {
      await axios.post(`${env.make.webhookUrl}/send`, {
        phoneNumber,
        message
      });
    } catch (error) {
      handleServiceError(error, 'WhatsApp.sendMessage');
    }
  },

  async handleIncomingMessage(message: Message): Promise<{ success: boolean; message: string }> {
    try {
      return {
        success: true,
        message: 'Message received'
      };
    } catch (error) {
      return handleServiceError(error, 'WhatsApp.handleIncomingMessage');
    }
  }
};