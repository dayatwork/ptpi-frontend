import axios from "redaxios";
import { ConsultationSchedule, ConsultationSlot } from "./consultation";
import { BookConsultationInput } from "./consultation.validation";

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

type BookConsultationResponse = {
  data: ConsultationSlot;
};

export async function bookConsultation(input: BookConsultationInput) {
  const slot = await axios
    .post<BookConsultationResponse>(`${CONSULTATION_API_URL}/book`, input, {
      withCredentials: true,
    })
    .then((r) => r.data.data);
  return slot;
}
