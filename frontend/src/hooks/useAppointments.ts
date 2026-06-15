import { useState, useEffect, useCallback } from 'react';
import { appointmentService, AppointmentAPI, AppointmentPayload } from '../services/appointment.service';

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (params?: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.list(params);
      setAppointments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchToday = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.today();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  const createAppointment = async (data: AppointmentPayload) => {
    const created = await appointmentService.create(data);
    setAppointments(prev => [...prev, created]);
    return created;
  };

  const updateAppointment = async (id: number, data: Partial<AppointmentPayload>) => {
    const updated = await appointmentService.update(id, data);
    setAppointments(prev => prev.map(a => (a.id === id ? updated : a)));
    return updated;
  };

  const deleteAppointment = async (id: number) => {
    await appointmentService.delete(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  return { appointments, loading, error, fetchAppointments, fetchToday, createAppointment, updateAppointment, deleteAppointment };
}
