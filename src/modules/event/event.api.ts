import axios from "redaxios";
import { Event } from "./event";
import { CreateEventInput, EditEventInput } from "./event.validation";

type ListEventsResponse = {
  data: Event[];
};

export async function listEvents() {
  const events = await axios
    .get<ListEventsResponse>(`${import.meta.env.VITE_API_URL}/api/events`, {
      withCredentials: true,
    })
    .then((r) => r.data.data);

  return events;
}

type GetEventsResponse = {
  data: Event;
};

interface GetEventInput {
  id: string;
}

export async function getEvent({ id }: GetEventInput) {
  const event = await axios
    .get<GetEventsResponse>(
      `${import.meta.env.VITE_API_URL}/api/events/${id}`,
      {
        withCredentials: true,
      }
    )
    .then((r) => r.data.data);

  return event;
}

type CreateEventResponse = {
  data: Event;
};

export async function createEvent(input: CreateEventInput) {
  const event = await axios
    .post<CreateEventResponse>(
      `${import.meta.env.VITE_API_URL}/api/events`,
      input,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return event;
}

type EditEventResponse = {
  data: Event;
};

export async function editEvent({ id, ...input }: EditEventInput) {
  const event = await axios
    .put<EditEventResponse>(
      `${import.meta.env.VITE_API_URL}/api/events/${id}`,
      input,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return event;
}

interface DeleteEventInput {
  id: string;
}

type DeleteEventResponse = {
  data: Event;
};

export async function deleteEvent({ id }: DeleteEventInput) {
  const event = await axios
    .delete<DeleteEventResponse>(
      `${import.meta.env.VITE_API_URL}/api/events/${id}`,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return event;
}
