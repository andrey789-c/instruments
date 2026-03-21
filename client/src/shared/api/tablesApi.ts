import { apiClient } from './apiClient';

export interface Table {
  id: string;
  name: string;
  ownerId: string;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableDto {
  name: string;
}

export interface UpdateTableDto {
  tableId: string;
  name: string;
}

class TablesApi {
  private readonly basePath = '/tables';

  async getAll(): Promise<Table[]> {
    return apiClient.get<Table[]>(this.basePath);
  }

  async getById(id: string): Promise<Table> {
    return apiClient.get<Table>(`${this.basePath}/${id}`);
  }

  async create(data: CreateTableDto): Promise<Table> {
    return apiClient.post<Table>(`${this.basePath}/create`, data);
  }

  async update(data: UpdateTableDto): Promise<Table> {
    return apiClient.post<Table>(`${this.basePath}/update`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/delete`, { id });
  }
}

export const tablesApi = new TablesApi();