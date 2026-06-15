import { apiRequest } from './api';

export interface ExamAPI {
  id: number;
  consultation: number;
  exam_type: string;
  status: string;
  notes?: string | null;
  results?: string | null;
  request_date: string;
  result_date?: string | null;
}

export interface ExamPayload {
  consultation: number;
  exam_type: string;
  status?: string;
  notes?: string;
  results?: string;
}

export const examService = {
  list(search?: string) {
    const params = search ? { search } : undefined;
    return apiRequest<ExamAPI[]>('/clinic/exams/', { params });
  },

  getById(id: number) {
    return apiRequest<ExamAPI>(`/clinic/exams/${id}/`);
  },

  create(data: ExamPayload) {
    return apiRequest<ExamAPI>('/clinic/exams/', { method: 'POST', body: data });
  },

  update(id: number, data: Partial<ExamPayload>) {
    return apiRequest<ExamAPI>(`/clinic/exams/${id}/`, { method: 'PATCH', body: data });
  },
};
