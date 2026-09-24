export function dashboardPath(id: string, isAdmin: boolean) {
  return isAdmin ? `/admin/${id}` : `/user/${id}`;
}
