export interface User {
  id: number;
  pubKey: string;
  role: string;
  banned: boolean;
  deletedAt?: string;
}