import axios from "redaxios";
import { SeminarParticipant } from "./seminar-participant";
import { RegisterSeminarParticipantInput } from "./seminar-participant.validation";

type ListSeminarParticipantsResponse = {
  data: SeminarParticipant[];
};

export async function listSeminarParticipants({
  seminarId,
}: {
  seminarId: string;
}) {
  const seminarParticipants = await axios
    .get<ListSeminarParticipantsResponse>(
      `${import.meta.env.VITE_API_URL}/api/seminars/${seminarId}/participants`,
      {
        withCredentials: true,
      }
    )
    .then((r) => r.data.data);

  return seminarParticipants;
}

type RegisterSeminarParticipantResponse = {
  data: SeminarParticipant;
};

export async function registerSeminarParticipant({
  seminarId,
  userId,
}: RegisterSeminarParticipantInput) {
  const seminarParticipant = await axios
    .post<RegisterSeminarParticipantResponse>(
      `${import.meta.env.VITE_API_URL}/api/seminars/${seminarId}/participants`,
      { userId },
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return seminarParticipant;
}
