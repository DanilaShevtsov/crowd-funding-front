export interface CompanyData {
  id: string;
  name: string;
  description: null | string;
  ownerId: string;
  status: string;
  type?: string;
  balance: number;
  goal: number;
  timeout: string;
  image: string;
  followerCount: number;
  deletedAt: null | string;
  owner: {
    id: string;
    pubKey: string;
    role: string;
    banned: boolean;
    deletedAt: null | string;
  }
}