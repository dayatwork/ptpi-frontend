export type Room = {
  name: string;
  activeRecording: boolean;
  departureTimeout: number;
  emptyTimeout: number;
  maxParticipants: number;
  metadata: string;
  numParticipants: number;
  numPublishers: number;
  sid: string;
  turnPassword: string;
};
