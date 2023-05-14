import {User} from './user'

export interface UsersDto {
  data: [User],
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: any
  },
  links: {
    current: string;
  }
}