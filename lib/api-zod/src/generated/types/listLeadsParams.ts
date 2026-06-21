import type { ListLeadsStatus } from "./listLeadsStatus";

export type ListLeadsParams = {
  page?: number;
  limit?: number;
  companyName?: string;
  status?: ListLeadsStatus;
};
