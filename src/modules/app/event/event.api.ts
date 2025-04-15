import axios from "redaxios";
import { Event, EventDetail } from "./event";

type ListEventsResponse = {
  data: Event[];
};

export type EventType = "upcoming" | "ongoing" | "previous";

export async function listEvents(type: EventType) {
  const events = await axios
    .get<ListEventsResponse>(
      `${import.meta.env.VITE_API_URL}/api/events/${type}`,
      {
        withCredentials: true,
      }
    )
    .then((r) => r.data.data);

  return events;
}

type GetEventResponse = {
  data: EventDetail;
};

interface GetEventInput {
  id: string;
}

export async function getEvent({ id }: GetEventInput) {
  const event = await axios
    .get<GetEventResponse>(`${import.meta.env.VITE_API_URL}/api/events/${id}`, {
      withCredentials: true,
    })
    .then((r) => r.data.data);

  return event;
}
