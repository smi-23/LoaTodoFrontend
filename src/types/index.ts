export enum Role {
  USER = "USER",
  GUEST = "GUEST",
  ADMIN = "ADMIN",
}

export interface BackendResponse<T> {
  message: string;
  data: T;
}
