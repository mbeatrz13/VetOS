import { apiRequest } from './api';

export interface AnimalAPI {
  id: number;
  tutor: number;
  tutor_name?: string;
  name: string;
  species: string;
  breed: string | null;
  date_of_birth: string | null;
  weight: number | null;
  active: boolean;
}

export interface AnimalPayload {
  tutor: number;
  name: string;
  species: string;
  breed?: string;
  date_of_birth?: string;
  weight?: number;
}

export const animalService = {
  list(search?: string) {
    const params = search ? { search } : undefined;
    return apiRequest<AnimalAPI[]>('/reception/animals/', { params });
  },

  getById(id: number) {
    return apiRequest<AnimalAPI>(`/reception/animals/${id}/`);
  },

  create(data: AnimalPayload) {
    return apiRequest<AnimalAPI>('/reception/animals/', { method: 'POST', body: data });
  },

  update(id: number, data: AnimalPayload) {
    return apiRequest<AnimalAPI>(`/reception/animals/${id}/`, { method: 'PUT', body: data });
  },

  delete(id: number) {
    return apiRequest<void>(`/reception/animals/${id}/`, { method: 'DELETE' });
  },
};
