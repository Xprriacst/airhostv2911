import Airtable from 'airtable';
import type { Property } from '../types';
import { env } from '../config/env';
import { API_CONFIG } from '../config/constants';
import { handleServiceError } from '../utils/error';

const base = new Airtable({
  apiKey: env.airtable.apiKey
}).base(env.airtable.baseId);

const mapRecordToProperty = (record: Airtable.Record<any>): Property => ({
  id: record.id,
  name: record.get('Name') as string || '',
  address: record.get('Address') as string || '',
  checkInTime: record.get('CheckIn Time') as string || '',
  checkOutTime: record.get('CheckOut Time') as string || '',
  maxGuests: record.get('Max Guests') as number || 0,
  accessCodes: {
    wifi: {
      name: record.get('WiFi Name') as string || '',
      password: record.get('WiFi Password') as string || ''
    },
    door: record.get('Door Code') as string || ''
  },
  amenities: (record.get('Amenities') as string[] || []),
  houseRules: (record.get('House Rules') as string[] || []),
  photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']
});

export const airtableService = {
  async getProperties(): Promise<Property[]> {
    try {
      const records = await base(API_CONFIG.AIRTABLE.TABLES.PROPERTIES)
        .select({ view: API_CONFIG.AIRTABLE.VIEWS.DEFAULT })
        .all();

      return records.map(mapRecordToProperty);
    } catch (error) {
      return handleServiceError(error, 'Airtable.getProperties');
    }
  },

  async createProperty(data: Omit<Property, 'id'>): Promise<Property> {
    try {
      const record = await base(API_CONFIG.AIRTABLE.TABLES.PROPERTIES).create({
        Name: data.name,
        Address: data.address,
        'CheckIn Time': data.checkInTime,
        'CheckOut Time': data.checkOutTime,
        'Max Guests': data.maxGuests,
        'WiFi Name': data.accessCodes.wifi.name,
        'WiFi Password': data.accessCodes.wifi.password,
        'Door Code': data.accessCodes.door,
        'House Rules': data.houseRules,
        'Amenities': data.amenities
      });

      return mapRecordToProperty(record);
    } catch (error) {
      return handleServiceError(error, 'Airtable.createProperty');
    }
  },

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    try {
      const record = await base(API_CONFIG.AIRTABLE.TABLES.PROPERTIES).update(id, {
        ...(data.name && { Name: data.name }),
        ...(data.address && { Address: data.address }),
        ...(data.checkInTime && { 'CheckIn Time': data.checkInTime }),
        ...(data.checkOutTime && { 'CheckOut Time': data.checkOutTime }),
        ...(data.maxGuests && { 'Max Guests': data.maxGuests }),
        ...(data.accessCodes?.wifi.name && { 'WiFi Name': data.accessCodes.wifi.name }),
        ...(data.accessCodes?.wifi.password && { 'WiFi Password': data.accessCodes.wifi.password }),
        ...(data.accessCodes?.door && { 'Door Code': data.accessCodes.door }),
        ...(data.houseRules && { 'House Rules': data.houseRules }),
        ...(data.amenities && { 'Amenities': data.amenities })
      });

      return mapRecordToProperty(record);
    } catch (error) {
      return handleServiceError(error, 'Airtable.updateProperty');
    }
  },

  async deleteProperty(id: string): Promise<{ success: boolean }> {
    try {
      await base(API_CONFIG.AIRTABLE.TABLES.PROPERTIES).destroy(id);
      return { success: true };
    } catch (error) {
      return handleServiceError(error, 'Airtable.deleteProperty');
    }
  }
};