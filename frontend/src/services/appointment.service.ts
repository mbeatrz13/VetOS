import { apiRequest } from './api';

export interface AppointmentAPI {
  id: number;
  animal: number;
  animal_name?: string;
  tutor_name?: string;
  veterinarian: number;
  vet_name?: string;
  receptionist?: number | null;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string | null;
}

export interface AppointmentPayload {
  animal: number;
  veterinarian: number;
  receptionist?: number;
  date: string;
  time: string;
  type: string;
  status?: string;
  notes?: string;
}

export const appointmentService = {
  list(params?: Record<string, string>) {
    return apiRequest<AppointmentAPI[]>('/reception/appointments/', { params });
  },

  today() {
    return apiRequest<AppointmentAPI[]>('/reception/appointments/today/');
  },

  create(data: AppointmentPayload) {
    return apiRequest<AppointmentAPI>('/reception/appointments/', { method: 'POST', body: data });
  },

  update(id: number, data: Partial<AppointmentPayload>) {
    return apiRequest<AppointmentAPI>(`/reception/appointments/${id}/`, { method: 'PATCH', body: data });
  },

  delete(id: number) {
    return apiRequest<void>(`/reception/appointments/${id}/`, { method: 'DELETE' });
  },
};
