import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';

export interface MedicalRecordAPI {
  id: number;
  animal: number;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecordPayload {
  animal: number;
}

const medicalRecordService = {
  list(search?: string) {
    const params = search ? { search } : undefined;
    return apiRequest<MedicalRecordAPI[]>('/clinic/medical-records/', { params });
  },

  getById(id: number) {
    return apiRequest<MedicalRecordAPI>(`/clinic/medical-records/${id}/`);
  },

  create(data: MedicalRecordPayload) {
    return apiRequest<MedicalRecordAPI>('/clinic/medical-records/', { method: 'POST', body: data });
  },

  update(id: number, data: Partial<MedicalRecordPayload>) {
    return apiRequest<MedicalRecordAPI>(`/clinic/medical-records/${id}/`, { method: 'PATCH', body: data });
  },
};

export function useMedicalRecords() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicalRecords = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicalRecordService.list(search);
      setMedicalRecords(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setMedicalRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicalRecords();
  }, [fetchMedicalRecords]);

  const createMedicalRecord = async (data: MedicalRecordPayload) => {
    const created = await medicalRecordService.create(data);
    setMedicalRecords(prev => [...prev, created]);
    return created;
  };

  const updateMedicalRecord = async (id: number, data: Partial<MedicalRecordPayload>) => {
    const updated = await medicalRecordService.update(id, data);
    setMedicalRecords(prev => prev.map(m => (m.id === id ? updated : m)));
    return updated;
  };

  return { medicalRecords, loading, error, fetchMedicalRecords, createMedicalRecord, updateMedicalRecord };
}
