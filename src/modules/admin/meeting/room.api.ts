import axios from "redaxios";
import { Room } from "./room";

type ListRoomsResponse = {
  data: Room[];
};

export async function listRooms() {
  const rooms = await axios
    .get<ListRoomsResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/livekit/rooms`,
      { withCredentials: true }
    )
    .then((r) => r.data.data);

  return rooms;
}
