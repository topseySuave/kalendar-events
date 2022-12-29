import { PrismaClient } from "@prisma/client";
import prisma from "lib/prisma";
import EventServices, { TEvent } from "../service";

export default class EventRepository {
  prisma: PrismaClient;
  static prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  static async createEvent(data: TEvent) {
    try {
      const event = await EventServices.createEvent(data);
      return event;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateEvent(data: TEvent) {
    try {
      const event = await EventServices.updateEvent(data);
      return event;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async deleteEvent(eventId: string) {
    try {
      const event = await EventServices.deleteEvent(eventId);
      return event;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getAllEvent(params?: any) {
    try {
      const events = await EventServices.getAllEvent(params);
      return events;
    } catch (error) {
      console.log('error >> ', error);
      throw new Error(error);
    }
  }
}
