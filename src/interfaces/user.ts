export interface User {
  id: string;
  pubKey: string;
  role: string;
  banned: boolean;
  deletedAt?: string;
}