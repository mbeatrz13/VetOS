import { apiRequest } from './api';

export interface TutorAPI {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  animal_count?: number;
}

export interface TutorPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const tutorService = {
  list(search?: string) {
    const params = search ? { search } : undefined;
    return apiRequest<TutorAPI[]>('/reception/tutors/', { params });
  },

  getById(id: number) {
    return apiRequest<TutorAPI>(`/reception/tutors/${id}/`);
  },

  create(data: TutorPayload) {
    return apiRequest<TutorAPI>('/reception/tutors/', { method: 'POST', body: data });
  },

  update(id: number, data: TutorPayload) {
    return apiRequest<TutorAPI>(`/reception/tutors/${id}/`, { method: 'PUT', body: data });
  },

  delete(id: number) {
    return apiRequest<void>(`/reception/tutors/${id}/`, { method: 'DELETE' });
  },
};
