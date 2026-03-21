import { apiClient } from "./apiClient";

export interface UserListItem {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  organizationName: string;
  createdAt: string;
}

export interface ChangeRoleDto {
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
}

class UsersApi {
  private readonly basePath = '/users';


  async getAll(): Promise<UserListItem[]> {
    return apiClient.get<UserListItem[]>(this.basePath);
  }

  async changeRole(userId: string, role: string): Promise<UserListItem> {
    return apiClient.post<UserListItem>(`${this.basePath}/${userId}/role`, { role });
  }
}

export const usersApi = new UsersApi();