import axios from "redaxios";
import { useState } from "react";
// import { Track } from "livekit-client";
import { Button } from "@/components/ui/button";
import {
  VideoConference,
  DisconnectButton,
  LiveKitRoom,
  RoomAudioRenderer,
  // Chat,
  // ControlBar,
  // GridLayout,
  // ParticipantTile,
  // useRoomContext,
  // useTracks,
} from "@livekit/components-react";

import "@livekit/components-styles";
// import { LogOut } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
// const DEFAULT_TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI5ODA0MzcsImlzcyI6IkFQSWVoeUZRV1AzaWhYMiIsIm5hbWUiOiJkYXlhdCIsIm5iZiI6MTc0Mjg5NDAzNywic3ViIjoiZGF5YXQiLCJ2aWRlbyI6eyJyb29tIjoic2VtaW5hci0xIiwicm9vbUpvaW4iOnRydWV9fQ.zv1EVG-I4pVKu24wkjgCC4qDLVZ7WQDJmX7I2rBlHno";

type AccessTokenResponse = {
  data: {
    token: string;
    livekitUrl: string;
  };
};

export function MeetingRoom({
  label,
  roomName,
  participantName,
}: {
  label?: string;
  roomName: string;
  participantName: string;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const joinRoom = async () => {
    setIsLoading(true);
    const response = await axios.post<AccessTokenResponse>(
      `${API_URL}/api/admin/livekit/token`,
      { roomName, participantName },
      {
        withCredentials: true,
      }
    );
    setIsLoading(false);
    setToken(response.data.data.token);
    setLivekitUrl(response.data.data.livekitUrl);
  };

  if (!token || !livekitUrl) {
    return (
      <div className="bg-muted aspect-video rounded-lg flex flex-col items-center justify-center border">
        <h3 className="text-3xl font-semibold mb-4">
          {label || `Join room ${roomName}`}
        </h3>
        <Button onClick={joinRoom} disabled={isLoading}>
          {isLoading ? "Joining..." : "Join"}
        </Button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={livekitUrl}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      className="aspect-video"
    >
      {/* Your custom component with basic video conferencing functionality. */}
      {/* <MyVideoConference /> */}
      <VideoConference />
      <DisconnectButton />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

// function CustomControlBar({ onLeave }: { onLeave: () => void }) {
//   const room = useRoomContext();

//   return (
//     <div className="flex gap-2 items-center justify-center">
//       <ControlBar controls={{ leave: false }} />
//       <Button
//         variant="destructive"
//         onClick={() => {
//           room.disconnect();
//           onLeave();
//         }}
//         className="h-[43px]"
//       >
//         <LogOut />
//         Leave
//       </Button>
//     </div>
//   );
// }

// function MyVideoConference() {
//   // `useTracks` returns all camera and screen share tracks. If a user
//   // joins without a published camera track, a placeholder track is returned.
//   const tracks = useTracks(
//     [
//       { source: Track.Source.Camera, withPlaceholder: true },
//       { source: Track.Source.ScreenShare, withPlaceholder: false },
//     ],
//     { onlySubscribed: false }
//   );

//   return (
//     <GridLayout
//       tracks={tracks}
//       style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
//     >
//       {/* The GridLayout accepts zero or one child. The child is used
//       as a template to render all passed in tracks. */}
//       <ParticipantTile />
//     </GridLayout>
//   );
// }
