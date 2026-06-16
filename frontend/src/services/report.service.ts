import { apiRequest } from './api';

export interface ReportSummary {
  monthlyAppointments?: Array<{ mes: string; atendimentos: number; receita: number }>;
  appointmentsByType?: Array<{ nome: string; valor: number; cor: string }>;
  appointmentsBySpecies?: Array<{ nome: string; valor: number; cor: string }>;
  topProducts?: Array<{ produto: string; vendas: number }>;
}

export const reportService = {
  getSummary(periodo?: string) {
    const params = periodo ? { periodo } : undefined;
    return apiRequest<ReportSummary>('/reports/summary/', { params });
  },

  getAppointments(periodo?: string) {
    const params = periodo ? { periodo } : undefined;
    return apiRequest('/reports/appointments/', { params });
  },

  getFinancial(periodo?: string) {
    const params = periodo ? { periodo } : undefined;
    return apiRequest('/reports/financial/', { params });
  },

  getInventory(periodo?: string) {
    const params = periodo ? { periodo } : undefined;
    return apiRequest('/reports/inventory/', { params });
  },
};
