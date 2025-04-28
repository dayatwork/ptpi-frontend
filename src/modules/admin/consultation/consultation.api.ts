import axios from "redaxios";
import { Consultation, ConsultationSlot } from "./consultation";
import { Institution } from "../institution/institution";
import {
  BookConsultationInput,
  CreateConsultationInput,
  CreateConsultationSlotInput,
} from "./consultation.validation";
import { Event } from "../event/event";

const CONSULTATION_API_URL = `${import.meta.env.VITE_API_URL}/api/admin/consultations`;

type ListConsultationsResponse = {
  data: Consultation[];
};

interface ListConsultationsInput {
  eventId: string;
}

export async function listConsultations({ eventId }: ListConsultationsInput) {
  const consultations = await axios
    .get<ListConsultationsResponse>(CONSULTATION_API_URL, {
      withCredentials: true,
      params: { eventId },
    })
    .then((r) => r.data.data);

  return consultations;
}

type GetConsultationResponse = {
  data: Consultation & {
    slots: ConsultationSlot[];
    exhibitor: Institution;
    event: Event;
  };
};

interface GetConsultationInput {
  id: string;
}

export async function getConsultation({ id }: GetConsultationInput) {
  const consultation = await axios
    .get<GetConsultationResponse>(`${CONSULTATION_API_URL}/${id}`, {
      withCredentials: true,
    })
    .then((r) => r.data.data);

  return consultation;
}

type CreateConsultationResponse = {
  data: Consultation;
};

export async function createConsultation(input: CreateConsultationInput) {
  const consultation = await axios
    .post<CreateConsultationResponse>(CONSULTATION_API_URL, input, {
      withCredentials: true,
    })
    .then((r) => r.data.data);

  return consultation;
}

type CreateConsultationSlotResponse = {
  data: {
    consultation: Consultation;
    totalSlotCreated: number;
  };
};

export async function createConsultationSlot(
  input: CreateConsultationSlotInput
) {
  const { consultationId, slots } = input;
  const data = await axios
    .post<CreateConsultationSlotResponse>(
      `${CONSULTATION_API_URL}/${consultationId}/slots`,
      { slots },
      { withCredentials: true }
    )
    .then((r) => r.data.data);

  return data;
}

type BookConsultationResponse = {
  data: ConsultationSlot;
};

export async function bookConsultation({
  consultationId,
  ...input
}: BookConsultationInput) {
  const slot = await axios
    .post<BookConsultationResponse>(
      `${CONSULTATION_API_URL}/${consultationId}/slots/book`,
      input,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return slot;
}

type EditConsultationSlotResponse = {
  data: ConsultationSlot;
};

export async function editConsultationSlot({
  action,
  consultationId,
  slotId,
}: {
  consultationId: string;
  slotId: string;
  action:
    | "cancel"
    | "done"
    | "not-present"
    | "available"
    | "not-available"
    | "remove-participant";
}) {
  const slot = await axios
    .post<EditConsultationSlotResponse>(
      `${CONSULTATION_API_URL}/${consultationId}/slots/${slotId}/${action}`,
      null,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return slot;
}

type DeleteConsultationSlotResponse = {
  data: ConsultationSlot;
};

export async function deleteConsulationSlot({
  consultationId,
  slotId,
}: {
  consultationId: string;
  slotId: string;
}) {
  const slot = await axios
    .delete<DeleteConsultationSlotResponse>(
      `${CONSULTATION_API_URL}/${consultationId}/slots/${slotId}`,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return slot;
}
