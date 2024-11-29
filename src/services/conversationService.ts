import type { Conversation, Message } from '../types';
import { airtableService } from './airtableService';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    propertyId: '1',
    guestName: 'John Smith',
    checkIn: '2024-03-10',
    checkOut: '2024-03-15',
    messages: [
      {
        id: '1',
        text: "Hi! I just checked in but I can't find the WiFi password. Could you help?",
        isUser: false,
        timestamp: new Date('2024-03-10T14:30:00'),
        sender: 'John Smith'
      },
      {
        id: '2',
        text: "Of course! The WiFi password is 'sunset2024'. Let me know if you need anything else!",
        isUser: true,
        timestamp: new Date('2024-03-10T14:31:00'),
        sender: 'Host'
      }
    ]
  },
  {
    id: 'conv2',
    propertyId: '2',
    guestName: 'Emma Davis',
    checkIn: '2024-03-15',
    checkOut: '2024-03-20',
    messages: [
      {
        id: '1',
        text: "Hello! Is early check-in possible tomorrow?",
        isUser: false,
        timestamp: new Date('2024-03-14T10:15:00'),
        sender: 'Emma Davis'
      }
    ]
  }
];

export const conversationService = {
  async getConversations(): Promise<Conversation[]> {
    // TODO: Implement Airtable integration
    // For now, return mock data
    return MOCK_CONVERSATIONS;
  },

  async getConversationsByProperty(propertyId: string): Promise<Conversation[]> {
    const conversations = await this.getConversations();
    return conversations.filter(conv => conv.propertyId === propertyId);
  },

  async getConversation(id: string): Promise<Conversation | null> {
    const conversations = await this.getConversations();
    return conversations.find(conv => conv.id === id) || null;
  },

  async addMessage(conversationId: string, message: Omit<Message, 'id'>): Promise<Message> {
    // TODO: Implement Airtable integration
    const newMessage = {
      ...message,
      id: Date.now().toString()
    };
    return newMessage;
  }
};