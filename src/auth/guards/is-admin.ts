export function isAdmin({ user }: { user: { role?: string | null } }) {
  return user.role === "admin";
}
