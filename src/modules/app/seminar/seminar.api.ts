import axios from "redaxios";
import { SeminarParticipation } from "./seminar";

type RegisterSeminarResponse = {
  data: SeminarParticipation;
};

export async function registerSeminar(seminarId: string) {
  const seminar = await axios
    .post<RegisterSeminarResponse>(
      `${import.meta.env.VITE_API_URL}/api/seminars/${seminarId}/register`,
      null,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return seminar;
}

type GetSeminarParticipationsResponse = {
  data: SeminarParticipation[];
};

export async function getSeminarParticipations() {
  const event = await axios
    .get<GetSeminarParticipationsResponse>(
      `${import.meta.env.VITE_API_URL}/api/seminar-participants/me`,
      {
        withCredentials: true,
      }
    )
    .then((r) => r.data.data);

  return event;
}
