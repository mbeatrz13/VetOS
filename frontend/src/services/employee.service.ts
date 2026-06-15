import { apiRequest } from './api';

export interface EmployeeAPI {
  id: number;
  user: number;
  username?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: string;
  hire_date?: string | null;
  termination_date?: string | null;
  status: string;
}

export interface VeterinarianAPI {
  employee_id: number;
  name?: string;
  crmv: string;
  specialties?: { id: number; name: string }[];
}

export const employeeService = {
  list(search?: string) {
    const params = search ? { search } : undefined;
    return apiRequest<EmployeeAPI[]>('/reception/employees/', { params });
  },

  getById(id: number) {
    return apiRequest<EmployeeAPI>(`/reception/employees/${id}/`);
  },

  create(data: Partial<EmployeeAPI>) {
    return apiRequest<EmployeeAPI>('/reception/employees/', { method: 'POST', body: data });
  },

  update(id: number, data: Partial<EmployeeAPI>) {
    return apiRequest<EmployeeAPI>(`/reception/employees/${id}/`, { method: 'PATCH', body: data });
  },

  delete(id: number) {
    return apiRequest<void>(`/reception/employees/${id}/`, { method: 'DELETE' });
  },
};

export const veterinarianService = {
  list() {
    return apiRequest<VeterinarianAPI[]>('/reception/veterinarians/');
  },
};
