import axios from "redaxios";
import { ConsultationSchedule } from "./consultation";

const CONSULTATION_API_URL = `${import.meta.env.VITE_API_URL}/api/consultations`;

type ListConsultationSchedulesResponse = {
  data: ConsultationSchedule[];
};

export async function listConsultationSchedules() {
  const schedules = await axios
    .get<ListConsultationSchedulesResponse>(
      `${CONSULTATION_API_URL}/schedules`,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return schedules;
}
