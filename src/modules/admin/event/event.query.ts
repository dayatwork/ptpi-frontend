import {
  type QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { listEvents, getEvent } from "./event.api";
import { queryClient } from "@/main";

export const EVENTS_KEY = "admin-events";

export const listEventsQueryOptions = queryOptions({
  queryKey: [EVENTS_KEY],
  queryFn: listEvents,
});

export const useEvents = () => {
  return useSuspenseQuery(listEventsQueryOptions);
};

export const ensureEventsData = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(listEventsQueryOptions);

export const getEventQueryOptions = ({ id }: { id: string }) =>
  queryOptions({
    queryKey: [EVENTS_KEY, { id }],
    queryFn: () => getEvent({ id }),
  });

export const useEvent = ({ id }: { id: string }) => {
  return useSuspenseQuery(getEventQueryOptions({ id }));
};

export const ensureEventData = (
  { id }: { id: string },
  queryClient: QueryClient
) => queryClient.ensureQueryData(getEventQueryOptions({ id }));

export const invalidateEventQuery = (id: string) =>
  queryClient.invalidateQueries({ queryKey: [EVENTS_KEY, { id }] });
