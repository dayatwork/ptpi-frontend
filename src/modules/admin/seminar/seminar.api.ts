import axios from "redaxios";
import { Seminar } from "./seminar";
import { CreateSeminarInput, EditSeminarInput } from "./seminar.validation";
import { Event } from "../event/event";

type ListSeminarsResponse = {
  data: Seminar[];
};

export async function listSeminars() {
  const seminars = await axios
    .get<ListSeminarsResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/seminars`,
      {
        withCredentials: true,
      }
    )
    .then((r) => r.data.data);

  return seminars;
}

type GetSeminarResponse = {
  data: Seminar & { event: Event | null };
};

interface GetSeminarInput {
  id: string;
}

export async function getSeminar({ id }: GetSeminarInput) {
  const seminar = await axios
    .get<GetSeminarResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/seminars/${id}`,
      {
        withCredentials: true,
      }
    )
    .then((r) => r.data.data);

  return seminar;
}

type CreateSeminarResponse = {
  data: Seminar;
};

export async function createSeminar(input: CreateSeminarInput) {
  const seminar = await axios
    .post<CreateSeminarResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/seminars`,
      input,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return seminar;
}

type EditSeminarResponse = {
  data: Seminar;
};

export async function editSeminar({ id, ...input }: EditSeminarInput) {
  const seminar = await axios
    .put<EditSeminarResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/seminars/${id}`,
      input,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return seminar;
}

interface DeleteSeminarInput {
  id: string;
}

type DeleteSeminarResponse = {
  data: Seminar;
};

export async function deleteSeminar({ id }: DeleteSeminarInput) {
  const seminar = await axios
    .delete<DeleteSeminarResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/seminars/${id}`,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return seminar;
}

interface StartSeminarInput {
  id: string;
}

type StartSeminarResponse = {
  data: Seminar;
};

export async function startSeminar({ id }: StartSeminarInput) {
  const seminar = await axios
    .post<StartSeminarResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/seminars/${id}/start`,
      null,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return seminar;
}

interface CancelSeminarInput {
  id: string;
}

type CancelSeminarResponse = {
  data: Seminar;
};

export async function cancelSeminar({ id }: CancelSeminarInput) {
  const seminar = await axios
    .post<CancelSeminarResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/seminars/${id}/cancel`,
      null,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return seminar;
}

interface EndSeminarInput {
  id: string;
}

type EndSeminarResponse = {
  data: Seminar;
};

export async function endSeminar({ id }: EndSeminarInput) {
  const seminar = await axios
    .post<EndSeminarResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/seminars/${id}/end`,
      null,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return seminar;
}
