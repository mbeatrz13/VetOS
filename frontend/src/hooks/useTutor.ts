import { useState, useEffect, useCallback } from 'react';
import { tutorService, TutorAPI, TutorPayload } from '../services/tutor.service';

export function useTutors() {
  const [tutores, setTutores] = useState<TutorAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTutores = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tutorService.list(search);
      setTutores(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutores();
  }, [fetchTutores]);

  const createTutor = async (data: TutorPayload) => {
    const created = await tutorService.create(data);
    setTutores(prev => [...prev, created]);
    return created;
  };

  const updateTutor = async (id: number, data: TutorPayload) => {
    const updated = await tutorService.update(id, data);
    setTutores(prev => prev.map(t => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTutor = async (id: number) => {
    await tutorService.delete(id);
    setTutores(prev => prev.filter(t => t.id !== id));
  };

  return { tutores, loading, error, fetchTutores, createTutor, updateTutor, deleteTutor };
}
