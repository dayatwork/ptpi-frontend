import axios from "redaxios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  VideoConference,
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";

import "@livekit/components-styles";

const API_URL = import.meta.env.VITE_API_URL;

type AccessTokenResponse = {
  data: {
    token: string;
    livekitUrl: string;
  };
};

export function ConsultationRoomAdmin({
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
      data-lk-theme="default"
      className="aspect-video"
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
