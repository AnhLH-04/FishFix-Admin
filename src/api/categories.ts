// src/api/category.api.ts
import { apiClient } from "../api/apiClient";

export type CategoryDto = {
  categoryId: number;
  name: string;
  description: string | null;
  iconUrl: string | null;
  parentId: number | null;
  displayOrder: number;
  isActive: boolean;
};

export async function getCategories(activeOnly?: boolean) {
  const res = await apiClient.get<CategoryDto[]>("/api/categories", {
    params: activeOnly === undefined ? undefined : { activeOnly },
  });
  return res.data;
}
