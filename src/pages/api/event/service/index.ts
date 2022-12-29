import { PrismaClient } from "@prisma/client";
import prisma from "lib/prisma";

// @ts-ignore
export type TEvent = PrismaClient["event"]["create"]["data"];

export default class EventServices {
  static prisma: PrismaClient = prisma;

  static async createEvent(data: TEvent) {
    const event = await prisma.event.create({
      data,
    });
    return event;
  }

  static async getAllEvent(params?: any) {
    const event = await this.prisma.event.findMany(params);
    return event;
  }

  static async getEvent(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    return event;
  }

  static async updateEvent(data: TEvent) {
    const updatedEvent = await this.prisma.event.update({
      where: { id: data.id },
      data,
    });
    return updatedEvent;
  }

  static async deleteEvent(id: string) {
    const event = await this.prisma.event.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    return event;
  }
}
