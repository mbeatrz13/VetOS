import { apiRequest } from './api';

export interface PrescriptionAPI {
  id: number;
  consultation: number;
  product?: number;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  issued_at: string;
}

export interface PrescriptionPayload {
  consultation: number;
  product?: number;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export const prescriptionService = {
  list(search?: string) {
    const params = search ? { search } : undefined;
    return apiRequest<PrescriptionAPI[]>('/clinic/prescriptions/', { params });
  },

  getById(id: number) {
    return apiRequest<PrescriptionAPI>(`/clinic/prescriptions/${id}/`);
  },

  create(data: PrescriptionPayload) {
    return apiRequest<PrescriptionAPI>('/clinic/prescriptions/', { method: 'POST', body: data });
  },

  update(id: number, data: Partial<PrescriptionPayload>) {
    return apiRequest<PrescriptionAPI>(`/clinic/prescriptions/${id}/`, { method: 'PATCH', body: data });
  },
};
