import { apiRequest } from './api';

export interface ConsultationAPI {
  id: number;
  medical_record: number;
  veterinarian: number;
  appointment?: number | null;
  datetime: string;
  type: string;
  status: string;
  symptoms?: string | null;
  diagnosis?: string | null;
}

export interface ConsultationPayload {
  medical_record: number;
  veterinarian: number;
  appointment?: number;
  type: string;
  status?: string;
  symptoms?: string;
  diagnosis?: string;
}

export const consultationService = {
  list(search?: string) {
    const params = search ? { search } : undefined;
    return apiRequest<ConsultationAPI[]>('/clinic/consultations/', { params });
  },

  getById(id: number) {
    return apiRequest<ConsultationAPI>(`/clinic/consultations/${id}/`);
  },

  create(data: ConsultationPayload) {
    return apiRequest<ConsultationAPI>('/clinic/consultations/', { method: 'POST', body: data });
  },

  update(id: number, data: Partial<ConsultationPayload>) {
    return apiRequest<ConsultationAPI>(`/clinic/consultations/${id}/`, { method: 'PATCH', body: data });
  },
};
