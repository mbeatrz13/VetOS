import { useState, useEffect, useCallback } from 'react';
import { consultationService, ConsultationAPI, ConsultationPayload } from '../services/medical-record.service';

export function useConsultations() {
  const [consultations, setConsultations] = useState<ConsultationAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultationService.list(search);
      setConsultations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const createConsultation = async (data: ConsultationPayload) => {
    const created = await consultationService.create(data);
    setConsultations(prev => [...prev, created]);
    return created;
  };

  const updateConsultation = async (id: number, data: Partial<ConsultationPayload>) => {
    const updated = await consultationService.update(id, data);
    setConsultations(prev => prev.map(c => (c.id === id ? updated : c)));
    return updated;
  };

  return { consultations, loading, error, fetchConsultations, createConsultation, updateConsultation };
}
