import { authClient, type Session } from "@/auth/auth-client";

export async function getUserSession() {
  const { data } = await authClient.getSession();
  return data;
}

export async function listSessions() {
  const { data } = await authClient.listSessions();
  return data as Session["session"][];
}

export async function listPasskeys() {
  const { data } = await authClient.passkey.listUserPasskeys();
  return data;
}

export async function listUsers({
  limit = 100,
  offset = 0,
}: {
  limit: number;
  offset: number;
}) {
  const { data } = await authClient.admin.listUsers({
    query: { limit, offset },
  });
  return data;
}
