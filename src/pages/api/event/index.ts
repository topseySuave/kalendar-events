import { NextApiRequest, NextApiResponse } from "next";
import EventRepository from "./repository";

// This is the handler function that will be called when the API route is hit by the client
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = (req.body.id as string) || (req.query.eventId as string);
  const { method } = req;

  switch (
    method // method is a string type and it can be GET, POST, PUT, PATCH, DELETE etc
  ) {
    case "GET":
      let events: any[];
      const where = !!id ? { id } : { isDeleted: false }; // !!id is a trick to convert id to boolean value

      // if id is not null then it will be true and where will be { id } otherwise it will be { isDeleted: false }
      events = await EventRepository.getAllEvent({ where });

      // Return events as JSON object to the client
      res.json(events);
      break;
    case "POST":
      // Create a new event in the database
      const eventRes = await EventRepository.createEvent(req.body);

      // Return the new event as JSON object to the client
      res.json(eventRes);
      break;
    case "PUT":
      // Update an existing event in the database
      const updatedEventRes = await EventRepository.updateEvent(req.body);

      // Return the updated event as JSON object to the client
      res.json(updatedEventRes);
      break;
    case "PATCH":
      break;
    case "DELETE":
      // Delete an existing event in the database
      const deletedEventRes = await EventRepository.deleteEvent(id);

      // Return the deleted event as JSON object to the client
      res.json(deletedEventRes);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
