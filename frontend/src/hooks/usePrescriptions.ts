import { useState, useEffect, useCallback } from 'react';
import { prescriptionService, PrescriptionAPI, PrescriptionPayload } from '../services/prescription.service';

export function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescriptions = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await prescriptionService.list(search);
      setPrescriptions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const createPrescription = async (data: PrescriptionPayload) => {
    const created = await prescriptionService.create(data);
    setPrescriptions(prev => [...prev, created]);
    return created;
  };

  const updatePrescription = async (id: number, data: Partial<PrescriptionPayload>) => {
    const updated = await prescriptionService.update(id, data);
    setPrescriptions(prev => prev.map(p => (p.id === id ? updated : p)));
    return updated;
  };

  return { prescriptions, loading, error, fetchPrescriptions, createPrescription, updatePrescription };
}
