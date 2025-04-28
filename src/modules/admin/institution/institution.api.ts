import axios from "redaxios";
import { Institution } from "./institution";

type ListInstitutionsResponse = {
  data: Institution[];
};

export type ListInstitutionsProps = {
  search: string;
};

export async function listInstitutions(props?: ListInstitutionsProps) {
  const institutions = await axios
    .get<ListInstitutionsResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/institutions`,
      {
        withCredentials: true,
        params: props?.search
          ? {
              q: props.search,
            }
          : undefined,
      }
    )
    .then((r) => r.data.data);

  return institutions;
}

type GetInstitutionsResponse = {
  data: Institution;
};

interface GetInstitutionInput {
  id: string;
}

export async function getInstitution({ id }: GetInstitutionInput) {
  const institution = await axios
    .get<GetInstitutionsResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/institutions/${id}`,
      {
        withCredentials: true,
      }
    )
    .then((r) => r.data.data);

  return institution;
}

interface CreateInstitutionInput {
  name: string;
  logo?: string;
}

type CreateInstitutionResponse = {
  data: Institution;
};

export async function createInstitution({
  name,
  logo,
}: CreateInstitutionInput) {
  const institution = await axios
    .post<CreateInstitutionResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/institutions`,
      { name, logo },
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return institution;
}

interface EditInstitutionInput {
  id: string;
  name: string;
  logo?: string;
}

type EditInstitutionResponse = {
  data: Institution;
};

export async function editInstitution({
  id,
  name,
  logo,
}: EditInstitutionInput) {
  const institution = await axios
    .put<EditInstitutionResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/institutions/${id}`,
      { name, logo },
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return institution;
}

interface DeleteInstitutionInput {
  id: string;
}

type DeleteInstitutionResponse = {
  data: Institution;
};

export async function deleteInstitution({ id }: DeleteInstitutionInput) {
  const institution = await axios
    .delete<DeleteInstitutionResponse>(
      `${import.meta.env.VITE_API_URL}/api/admin/institutions/${id}`,
      { withCredentials: true }
    )
    .then((r) => r.data.data);
  return institution;
}
