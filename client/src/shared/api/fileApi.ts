import { apiClient } from "./apiClient";

class FilesApi {

  async uploadExcel(file: File, tableId: string): Promise<{ imported: number }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tableId', tableId);

    return apiClient.upload<{ imported: number }>('/import/excel', formData);
  }

  async exportExcel(tableId: string): Promise<Blob> {
    // Для загрузки файлов нужен специальный метод
    const token = apiClient.isAuthenticated() ? localStorage.getItem('auth_token') : null;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/export/excel?tableId=${tableId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    if (!response.ok) {
      throw new Error('Ошибка экспорта');
    }

    return response.blob();
  }
}

export const filesApi = new FilesApi();