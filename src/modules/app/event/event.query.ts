import {
  type QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { type EventType, getEvent, listEvents } from "./event.api";
import { queryClient } from "@/main";

export const EVENTS_KEY = "events";

export const listEventsQueryOptions = (eventType: EventType) =>
  queryOptions({
    queryKey: [EVENTS_KEY, eventType],
    queryFn: () => listEvents(eventType),
    staleTime: 1000 * 60,
  });

export const useSuspenseEvents = (eventType: EventType) => {
  return useSuspenseQuery(listEventsQueryOptions(eventType));
};

export const useEvents = (eventType: EventType) => {
  return useQuery(listEventsQueryOptions(eventType));
};

export const ensureEventsData = (
  queryClient: QueryClient,
  eventType: EventType
) => queryClient.ensureQueryData(listEventsQueryOptions(eventType));

export const invalidateEventsQuery = (eventType: EventType) =>
  queryClient.invalidateQueries({ queryKey: [EVENTS_KEY, eventType] });

export const getEventQueryOptions = ({ id }: { id: string }) =>
  queryOptions({
    queryKey: [EVENTS_KEY, { id }],
    queryFn: () => getEvent({ id }),
    staleTime: 1000 * 60,
  });

export const useSuspenseEvent = ({ id }: { id: string }) => {
  return useSuspenseQuery(getEventQueryOptions({ id }));
};

export const useEvent = ({ id }: { id: string }) => {
  return useQuery(getEventQueryOptions({ id }));
};

export const ensureEventData = (
  { id }: { id: string },
  queryClient: QueryClient
) => queryClient.ensureQueryData(getEventQueryOptions({ id }));

export const invalidateEventQuery = (id: string) =>
  queryClient.invalidateQueries({ queryKey: [EVENTS_KEY, { id }] });
