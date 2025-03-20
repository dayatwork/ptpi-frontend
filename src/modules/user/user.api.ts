import { authClient } from "@/auth/auth-client";
import axios from "redaxios";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  twoFactorEnabled: boolean | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
};

type ListUsersResponse = {
  data: User[];
};

type ListUsersProps = {
  search: string;
};

export async function listUsers(props?: ListUsersProps) {
  const users = await axios
    .get<ListUsersResponse>(`${import.meta.env.VITE_API_URL}/api/users`, {
      withCredentials: true,
      params: props?.search
        ? {
            q: props.search,
          }
        : undefined,
    })
    .then((r) => r.data.data);

  return users;
}

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export async function createUser({ email, name, password }: CreateUserInput) {
  const user = await authClient.admin.createUser({
    name,
    email,
    password,
    role: "user",
  });
  return user;
}
