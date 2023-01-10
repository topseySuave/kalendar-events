import { CurrentEventData, EventData } from "./types";

// find event with id
export const findEvent = (events: EventData[], id: string): EventData => {
  return events.find((event) => event.id === id);
};

export const findAndUpdateCurrentEvents = (
  events: CurrentEventData[],
  id: string,
  newEvent: EventData
): CurrentEventData[] => {
  // create a new event object with the updated data
  const newCurrentEvent = {
    id: newEvent.id,
    title: newEvent.title,
    description: newEvent.description,
    date: newEvent.start_date,
    end: newEvent.end_date,
    start_date: newEvent.start_date,
    end_date: newEvent.end_date,
    classNames: ["event-date"],
  };

  // check if the event already exists in the events array
  const eventExists = events.find((event) => event.id === id);

  // if the event doesn't exist, add the new event to the array
  if (!eventExists) {
    return [...events, newCurrentEvent];
  }

  // if the event exists, replace it with the new event
  return events.map((event) => (event.id === id ? newCurrentEvent : event));
};
