import axios from "redaxios";
import { Seminar } from "./seminar";
import { CreateSeminarInput, EditSeminarInput } from "./seminar.validation";

type ListSeminarsResponse = {
  data: Seminar[];
};

export async function listSeminars() {
  const seminars = await axios
    .get<ListSeminarsResponse>(`${import.meta.env.VITE_API_URL}/api/seminars`, {
      withCredentials: true,
    })
    .then((r) => r.data.data);

  return seminars;
}

type GetSeminarsResponse = {
  data: Seminar;
};

interface GetSeminarInput {
  id: string;
}

export async function getSeminar({ id }: GetSeminarInput) {
  const seminar = await axios
    .get<GetSeminarsResponse>(
      `${import.meta.env.VITE_API_URL}/api/seminars/${id}`,
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
      `${import.meta.env.VITE_API_URL}/api/seminars`,
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
      `${import.meta.env.VITE_API_URL}/api/seminars/${id}`,
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
      `${import.meta.env.VITE_API_URL}/api/seminars/${id}`,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return seminar;
}
