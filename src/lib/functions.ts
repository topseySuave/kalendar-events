import { EventData } from "./types";

// find event with id
export const findEvent = (events: EventData[], id: string) => {
  return events.find((event) => event.id === id);
};
