import { apiClient } from "./apiClient";

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  tableId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddItemDto {
  tableId: string;
  name: string;
  description: string;
  price: number;
}

export interface UpdateItemDto {
  itemId: string;
  name?: string;
  description?: string;
  price?: number;
}

class ItemsApi {
  private readonly basePath = '/tables/item';

  async add(data: AddItemDto): Promise<Item> {
    return apiClient.post<Item>(`${this.basePath}/add`, data);
  }

  async update(data: UpdateItemDto): Promise<Item> {
    return apiClient.post<Item>(`${this.basePath}/update`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/delete`, { id });
  }
}

export const itemsApi = new ItemsApi();